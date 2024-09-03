import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { BatchGetItemCommandInput, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { customAlphabet } from 'nanoid';
import { marshall } from '@aws-sdk/util-dynamodb';

import { DynamoDbPaginated, SimpleDynamoDbService } from '@curi-com-services/lambda';
import { AuthorizedCognitoUser, cleanDeep } from '@curi-com-services/data';
import {
  StageChangeEvent,
  SubmissionAccess,
  SubmissionAccessIdType,
  SubmissionDetails,
  SubmissionDocument,
  SubmissionRisk,
  RosterExtractorData,
  SubmissionStage,
} from '@curi-com-services/submission-input-common';

import {
  DatabaseQueryParameters,
  ROSTER_EXTRACTOR_DATA_PK,
  RosterExtractorDataPk,
  RosterExtractorDataSk,
  SUBMISSION_ACCESS_SK_PREFIX,
  SUBMISSION_DETAILS_SK_PREFIX,
  SUBMISSION_DOCUMENT_SK_PREFIX,
  SUBMISSION_ID_PREFIX,
  SUBMISSION_PK_PREFIX,
  SUBMISSION_RISK_SK_PREFIX,
  StageChangeEventDatabaseItem,
  SubmissionAccessDatabaseItem,
  SubmissionAccessDatabaseItemStageSk,
  SubmissionAccessSk,
  SubmissionDetailsDatabaseItem,
  SubmissionDetailsDatabaseItemExternalStage,
  SubmissionDetailsDatabaseItemStageSk,
  SubmissionDetailsSk,
  SubmissionDocumentDatabaseItem,
  SubmissionDocumentSk,
  SubmissionPk,
  SubmissionRiskDatabaseItem,
  SubmissionRiskSk,
  RosterExtractorDataDatabaseItem,
} from './databaseTypes';

const submissionNanoId = customAlphabet('23456789ABCDEFGHJKMNPQRSTUVWXYZ', 8);

const submissionDetailsQueryProjection = [
  'pk',
  'sk',
  'id',
  'createdDate',
  'creator',
  'stage',
  '#status',
  'approvalStatus',
  '#name',
  'salesforceOpportunityId',
  'assignee',
  'account',
  'salesforceAccountId',
  'salesforceAccountName',
  'salesforceAgencyId',
  'salesforceAgencyName',
  'salesforceAgentProducerId',
  'salesforceAgentSubmitterId',
  'salesforceAgentProducerName',
  'salesforceAgentSubmitterName',
  'claims',
  'expiringPremium',
  'network',
  'brokerCommentsAndPracticeDescription',
  'policyTypes',
  'stateCodes',
  'targetPremium',
  'submissionType',
  'targetEffectiveDate',
  'desiredIndicationReturnDate',
  'closeAfterDate',
].join(',');
const submissionDetailsExpressionAttributeNames = { '#status': 'status', '#name': 'name' };

const submissionStageChangeEventsQueryProjection = ['pk', 'sk', 'stageChangeEvents'].join(',');

const submissionRisksQueryProjection = [
  'pk',
  'sk',
  'id',
  'csvLineNumber',
  'entityName',
  'firstName',
  'middleName',
  'lastName',
  'suffixes',
  'licenseNumber',
  'npi',
  'classification',
  '#state',
  'stateCode',
  'county',
  'specialty',
  'retroDate',
  'limits',
  'createdDate',
].join(',');

const internalStageIndex = 'stage-stageSk-index';
const accessStageIndex = 'sk-stageSk-index';
const rosterExtractorDataIndex = 'pk-createdDate-index';

@Injectable()
export class DatabaseService {
  private submissionTable: string;

  constructor(private readonly configService: ConfigService, private readonly dynamoDbService: SimpleDynamoDbService) {
    this.submissionTable = this.configService.get<string>('DYNAMO_DB_SUBMISSION_TABLE_NAME');
  }

  async getSubmissionId(): Promise<string> {
    const id = `${SUBMISSION_ID_PREFIX}${submissionNanoId()}`;

    const item = await this.dynamoDbService.getItem<unknown>({
      TableName: this.submissionTable,
      Key: marshall({
        pk: getSubmissionPk(id),
        sk: getSubmissionDetailsSk(id),
      }),
    });

    if (item) {
      Logger.log('Submission id collision, regenerating', { id });
      return this.getSubmissionId();
    }

    return id;
  }

  async createSubmission(
    details: SubmissionDetails,
    access: SubmissionAccess[] = [],
    documents: SubmissionDocument[] = [],
    risks: SubmissionRisk[] = [],
    rosterExtractorData?: RosterExtractorData
  ): Promise<boolean> {
    const detailsItem = mapSubmissionDetailsToDatabase(details);
    // set initial stageChangeEvents
    detailsItem.stageChangeEvents = Array.isArray(detailsItem.stageChangeEvents)
      ? detailsItem.stageChangeEvents
      : [
          mapSubmissionStageChangeEventToDatabase({
            toStage: details.stage,
            date: new Date(),
          }),
        ];

    const accessItems = access.map((a) =>
      mapSubmissionAccessToDatabase(details.id, a, details.stage, detailsItem.createdDate)
    );
    const documentItems = documents.map((d) => mapSubmissionDocumentToDatabase(details.id, d));
    const riskItems = risks.map((r) => mapSubmissionRiskToDatabase(details.id, r));
    const rosterExtractorDataItem = rosterExtractorData
      ? mapRosterExtractorDataToDatabase(
          details.salesforceAgencyId,
          details.salesforceAgentSubmitterId,
          details.id,
          rosterExtractorData
        )
      : null;

    const isSuccessful = await this.dynamoDbService.batchWriteItemAll({
      RequestItems: {
        [this.submissionTable]: [
          {
            PutRequest: {
              Item: marshall(detailsItem, { removeUndefinedValues: true }),
            },
          },
          ...accessItems.map((a) => ({
            PutRequest: {
              Item: marshall(a, { removeUndefinedValues: true }),
            },
          })),
          ...documentItems.map((d) => ({
            PutRequest: {
              Item: marshall(d, { removeUndefinedValues: true }),
            },
          })),
          ...riskItems.map((r) => ({
            PutRequest: {
              Item: marshall(r, { removeUndefinedValues: true }),
            },
          })),
          ...(rosterExtractorDataItem
            ? [
                {
                  PutRequest: {
                    Item: marshall(rosterExtractorDataItem, { removeUndefinedValues: true }),
                  },
                },
              ]
            : []),
        ],
      },
    });

    return isSuccessful;
  }

  async checkIfUserHasAccessToSubmission(submissionId: string, access: SubmissionAccess): Promise<boolean> {
    const item = await this.dynamoDbService.getItem<unknown>({
      TableName: this.submissionTable,
      Key: marshall({
        pk: getSubmissionPk(submissionId),
        sk: getSubmissionAccessSk(access),
      }),
    });

    return Boolean(item);
  }

  async getSubmissionDetails(submissionId: string): Promise<SubmissionDetails | null> {
    const item = await this.getSubmissionDetailsItem(submissionId);
    if (!item) {
      return null;
    }

    return mapSubmissionDetailsFromDatabase(item);
  }

  async getSubmissionStageChangeEvents(submissionId: string): Promise<StageChangeEvent[] | null> {
    const item = await this.dynamoDbService.getItem<SubmissionDetailsDatabaseItem>({
      TableName: this.submissionTable,
      Key: marshall({
        pk: getSubmissionPk(submissionId),
        sk: getSubmissionDetailsSk(submissionId),
      }),
      ProjectionExpression: submissionStageChangeEventsQueryProjection,
    });

    if (!item) {
      return null;
    }

    return (item.stageChangeEvents || []).map(mapSubmissionStageChangeEventFromDatabase);
  }

  private getSubmissionDetailsItem(submissionId: string): Promise<SubmissionDetailsDatabaseItem | null> {
    return this.dynamoDbService.getItem<SubmissionDetailsDatabaseItem>({
      TableName: this.submissionTable,
      Key: marshall({
        pk: getSubmissionPk(submissionId),
        sk: getSubmissionDetailsSk(submissionId),
      }),
      ProjectionExpression: submissionDetailsQueryProjection,
      ExpressionAttributeNames: submissionDetailsExpressionAttributeNames,
    });
  }

  async getSubmissionRisks(
    submissionId: string,
    params?: DatabaseQueryParameters
  ): Promise<DynamoDbPaginated<SubmissionRisk> | null> {
    const response = await this.getSubmissionRiskItems(submissionId, params);
    if (!response || !response.items) {
      return null;
    }

    return {
      items: response.items.map(mapSubmissionRiskFromDatabase).sort((a, b) => a.csvLineNumber - b.csvLineNumber),
      lastEvaluatedKey: response.lastEvaluatedKey,
    };
  }

  private getSubmissionRiskItems(
    submissionId: string,
    params?: DatabaseQueryParameters
  ): Promise<DynamoDbPaginated<SubmissionRiskDatabaseItem> | null> {
    return this.dynamoDbService.queryItems<SubmissionRiskDatabaseItem>({
      TableName: this.submissionTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: marshall({
        ':pk': getSubmissionPk(submissionId),
        ':sk': `${SUBMISSION_RISK_SK_PREFIX}#`,
      }),
      ProjectionExpression: submissionRisksQueryProjection,
      ExpressionAttributeNames: {
        '#state': 'state',
      },
      Limit: params?.limit,
      ExclusiveStartKey: params?.exclusiveStartKey ? marshall(params.exclusiveStartKey) : undefined,
      FilterExpression: params?.filterExpression,
    });
  }

  async getSubmissionDocuments(
    submissionId: string,
    params?: DatabaseQueryParameters
  ): Promise<DynamoDbPaginated<SubmissionDocument> | null> {
    const response = await this.getSubmissionDocumentItems(submissionId, params);
    if (!response || !response.items) {
      return null;
    }

    return {
      items: response.items.map(mapSubmissionDocumentFromDatabase),
      lastEvaluatedKey: response.lastEvaluatedKey,
    };
  }

  private getSubmissionDocumentItems(
    submissionId: string,
    params?: DatabaseQueryParameters
  ): Promise<DynamoDbPaginated<SubmissionDocumentDatabaseItem> | null> {
    return this.dynamoDbService.queryItems<SubmissionDocumentDatabaseItem>({
      TableName: this.submissionTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: marshall({
        ':pk': getSubmissionPk(submissionId),
        ':sk': `${SUBMISSION_DOCUMENT_SK_PREFIX}#`,
      }),
      ProjectionExpression: [
        'pk',
        'sk',
        'id',
        '#name',
        '#key',
        '#type',
        'streamFileId',
        'streamMessageId',
        'createdDate',
      ].join(','),
      ExpressionAttributeNames: {
        '#name': 'name',
        '#key': 'key',
        '#type': 'type',
      },
      Limit: params?.limit,
      ExclusiveStartKey: params?.exclusiveStartKey ? marshall(params.exclusiveStartKey) : undefined,
      FilterExpression: params?.filterExpression,
    });
  }

  async addSubmissionDocument(submissionId: string, document: SubmissionDocument): Promise<boolean> {
    const item = mapSubmissionDocumentToDatabase(submissionId, document);

    const isSuccessful = await this.dynamoDbService.putItem({
      TableName: this.submissionTable,
      Item: marshall(item, { removeUndefinedValues: true }),
    });

    return isSuccessful;
  }

  async getSubmissionDocument(submissionId: string, documentId: string): Promise<SubmissionDocument | null> {
    const document = await this.dynamoDbService.getItem<SubmissionDocumentDatabaseItem>({
      TableName: this.submissionTable,
      Key: marshall({
        pk: getSubmissionPk(submissionId),
        sk: getSubmissionDocumentSk(documentId),
      }),
      ProjectionExpression: [
        'pk',
        'sk',
        'id',
        '#name',
        '#key',
        '#type',
        'streamFileId',
        'streamMessageId',
        'createdDate',
      ].join(','),
      ExpressionAttributeNames: {
        '#name': 'name',
        '#key': 'key',
        '#type': 'type',
      },
    });

    if (!document) {
      return null;
    }

    return mapSubmissionDocumentFromDatabase(document);
  }

  async deleteSubmissionDocument(submissionId: string, documentId: string): Promise<boolean> {
    const isSuccessful = await this.dynamoDbService.deleteItem({
      TableName: this.submissionTable,
      Key: marshall({
        pk: getSubmissionPk(submissionId),
        sk: getSubmissionDocumentSk(documentId),
      }),
    });

    return isSuccessful;
  }

  async updateSubmissionDetails(
    details: SubmissionDetails,
    data: Partial<SubmissionDetails>
  ): Promise<SubmissionDetails> {
    Logger.log('Updating submission details', { details, data });
    const updateData = mapSubmissionDetailsUpdateToDatabase(data, details.createdDate);
    const originalItem = mapSubmissionDetailsToDatabase(details);

    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    const setStatements: string[] = [];
    const removeStatements: string[] = [];

    Object.keys(updateData).forEach((key) => {
      expressionAttributeNames[`#${key}`] = key;
      if (updateData[key] === null) {
        removeStatements.push(`#${key}`);
      } else {
        expressionAttributeValues[`:${key}`] = updateData[key];
        setStatements.push(`#${key} = :${key}`);
      }
    });

    if (data.stage && details.stage !== data.stage) {
      expressionAttributeNames['#stageChangeEvents'] = 'stageChangeEvents';
      expressionAttributeValues[':emptyList'] = [];
      expressionAttributeValues[':stageChangeEvents'] = [
        mapSubmissionStageChangeEventToDatabase({
          fromStage: details.stage,
          toStage: data.stage,
          date: new Date(),
        }),
      ];
      setStatements.push(
        `#stageChangeEvents = list_append(if_not_exists(#stageChangeEvents, :emptyList), :stageChangeEvents)`
      );
    }

    const setExpression = setStatements.length ? `set ${setStatements.join(', ')}` : null;
    const removeExpression = removeStatements.length ? `remove ${removeStatements.join(', ')}` : null;

    if (!setExpression && !removeExpression) {
      Logger.log('No data to update', { details, data });
      return details;
    }

    const updateExpression = [setExpression, removeExpression].filter((x) => x).join(' ');

    const isSuccessful = await this.dynamoDbService.updateItem({
      TableName: this.submissionTable,
      Key: marshall({
        pk: originalItem.pk,
        sk: originalItem.sk,
      }),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: Object.keys(expressionAttributeValues).length
        ? marshall(expressionAttributeValues)
        : undefined,
      UpdateExpression: updateExpression,
    });

    if (!isSuccessful) {
      throw new Error('Failed to update submission');
    }

    // if moving to closed stage, need to update access items
    if (data.stage === SubmissionStage.Closed && details.stage !== SubmissionStage.Closed) {
      const accessUpdatesSuccessful = await this.updateSubmissionAccessStage(
        details.id,
        data.stage,
        details.createdDate
      );
      if (!accessUpdatesSuccessful) {
        Logger.warn('Failed to update submission access items', { submissionId: details.id });
      }
    }

    return {
      ...details,
      ...data,
    };
  }

  private async updateSubmissionAccessStage(
    submissionId: string,
    stage: SubmissionStage,
    createdDate: Date
  ): Promise<boolean> {
    const submissionPk = getSubmissionPk(submissionId);
    const accessStageSk = mapSubmissionStageToAccessStageSk(stage, createdDate.toISOString());

    const accessItems = await this.dynamoDbService.queryItems<SubmissionAccessDatabaseItem>({
      TableName: this.submissionTable,
      KeyConditionExpression: `pk = :pk and begins_with(sk, :sk)`,
      ExpressionAttributeValues: marshall({
        ':pk': submissionPk,
        ':sk': `${SUBMISSION_ACCESS_SK_PREFIX}#`,
      }),
      ProjectionExpression: 'pk,sk,stageSk',
    });

    if (!accessItems || !Array.isArray(accessItems.items)) {
      return true;
    }

    const updateAccessItemsPromises = accessItems.items.map((accessItem) => {
      return this.dynamoDbService.updateItem({
        TableName: this.submissionTable,
        Key: marshall({
          pk: submissionPk,
          sk: accessItem.sk,
        }),
        UpdateExpression: 'set stageSk = :stageSk',
        ExpressionAttributeValues: marshall({
          ':stageSk': accessStageSk,
        }),
      });
    });

    const updateResponses = await Promise.all(updateAccessItemsPromises);
    return updateResponses.every((response) => response);
  }

  async getSubmissionDetailsByStage(
    stage: SubmissionStage,
    access?: SubmissionAccess,
    params: DatabaseQueryParameters = {
      limit: 25,
    }
  ): Promise<DynamoDbPaginated<SubmissionDetails> | null> {
    if (access) {
      return this.getSubmissionDetailsByStageWithAccess(stage, access, params);
    }

    return this.getSubmissionDetailsByStageWithoutAccess(stage, params);
  }

  private async getSubmissionDetailsByStageWithoutAccess(
    stage: SubmissionStage,
    params: DatabaseQueryParameters = {
      limit: 25,
    }
  ): Promise<DynamoDbPaginated<SubmissionDetails> | null> {
    const queryItemsInput: QueryCommandInput = {
      TableName: this.submissionTable,
      ExpressionAttributeNames: { '#status': 'status', '#name': 'name' },
      ProjectionExpression: submissionDetailsQueryProjection,
      ExclusiveStartKey: params.exclusiveStartKey ? marshall(params.exclusiveStartKey) : undefined,
      Limit: params.limit,
      KeyConditionExpression: `stage = :stage`,
      ExpressionAttributeValues: marshall({
        ':stage': stage,
      }),
      IndexName: internalStageIndex,
      ScanIndexForward: stage !== SubmissionStage.Closed,
    };

    const queryCountInput: QueryCommandInput = {
      TableName: this.submissionTable,
      Select: 'COUNT',
      KeyConditionExpression: `stage = :stage`,
      ExpressionAttributeValues: marshall({
        ':stage': stage,
      }),
      IndexName: internalStageIndex,
    };

    const [queryItemsResponse, queryCountResponse] = await Promise.all([
      this.dynamoDbService.queryItems<SubmissionDetailsDatabaseItem>(queryItemsInput),
      this.dynamoDbService.queryItemsCount(queryCountInput),
    ]);

    if (!Array.isArray(queryItemsResponse?.items)) {
      throw new Error('Failed to query submissions');
    }

    return {
      items: queryItemsResponse.items.map((item) => mapSubmissionDetailsFromDatabase(item)),
      lastEvaluatedKey: queryItemsResponse.lastEvaluatedKey,
      totalCount: queryCountResponse?.count,
    };
  }

  private async getSubmissionDetailsByStageWithAccess(
    stage: SubmissionStage,
    access: SubmissionAccess,
    params: DatabaseQueryParameters = {
      limit: 25,
    }
  ): Promise<DynamoDbPaginated<SubmissionDetails> | null> {
    const externalStage = mapSubmissionStageToExternal(stage);

    const accessResponse = await this.dynamoDbService.queryItems<SubmissionAccessDatabaseItem>({
      TableName: this.submissionTable,
      KeyConditionExpression: `sk = :sk and begins_with(stageSk, :stage)`,
      ExpressionAttributeValues: marshall({
        ':stage': `${externalStage}#`,
        ':sk': getSubmissionAccessSk(access),
      }),
      ProjectionExpression: 'pk,sk',
      IndexName: accessStageIndex,
      Limit: params.limit,
      ExclusiveStartKey: params.exclusiveStartKey ? marshall(params.exclusiveStartKey) : undefined,
      ScanIndexForward: stage !== SubmissionStage.Closed,
    });

    if (!Array.isArray(accessResponse?.items)) {
      // TODO check if this is the correct error to throw
      throw new Error('Failed to query submissions');
    }

    const submissionIds = accessResponse.items.map((item) => item.pk);
    if (submissionIds.length === 0) {
      return {
        items: [],
        lastEvaluatedKey: null,
        totalCount: 0,
      };
    }

    // note: limit of 100 items per batch
    const batchGetItemInput: BatchGetItemCommandInput = {
      RequestItems: {
        [this.submissionTable]: {
          Keys: submissionIds.map((submissionId) =>
            marshall({
              pk: submissionId,
              sk: submissionId,
            })
          ),
          ProjectionExpression: submissionDetailsQueryProjection,
          ExpressionAttributeNames: { '#status': 'status', '#name': 'name' },
        },
      },
    };

    const countQueryInput: QueryCommandInput = {
      TableName: this.submissionTable,
      KeyConditionExpression: `sk = :sk and begins_with(stageSk, :stage)`,
      ExpressionAttributeValues: marshall({
        ':stage': `${externalStage}#`,
        ':sk': getSubmissionAccessSk(access),
      }),
      IndexName: accessStageIndex,
      Select: 'COUNT',
    };

    const [items, queryCountResponse] = await Promise.all([
      this.dynamoDbService.batchGetItem<SubmissionDetailsDatabaseItem>(batchGetItemInput),
      this.dynamoDbService.queryItemsCount(countQueryInput),
    ]);

    if (!Array.isArray(items)) {
      throw new Error('Failed to query submissions');
    }

    // batch get item results are not sorted
    const sortFunction = stage === SubmissionStage.Closed ? sortByCreatedDateDesc : sortByCreatedDateAsc;
    const sortedItems = items.sort(sortFunction);

    return {
      items: sortedItems.map((item) => mapSubmissionDetailsFromDatabase(item)),
      lastEvaluatedKey: accessResponse.lastEvaluatedKey,
      totalCount: queryCountResponse?.count,
    };
  }

  async deleteSubmission(submissionId: string): Promise<boolean> {
    const partitionKeys = await this.dynamoDbService.queryAllItems<{ pk: string; sk: string }>({
      TableName: this.submissionTable,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: marshall({
        ':pk': getSubmissionPk(submissionId),
      }),
      ProjectionExpression: 'pk, sk',
    });

    if (!partitionKeys.length) {
      return true;
    }

    const isSuccessful = await this.dynamoDbService.batchWriteItemAll({
      RequestItems: {
        [this.submissionTable]: partitionKeys.map(({ pk, sk }) => ({
          DeleteRequest: {
            Key: marshall({
              pk,
              sk,
            }),
          },
        })),
      },
    });

    return isSuccessful;
  }

  async refreshSubmissionAccess(user: AuthorizedCognitoUser): Promise<number> {
    // Get all access records by user email
    const emailBasedAccessRecords = await this.getAllSubmissionAccessRecords({
      accessId: user.email,
      accessIdType: SubmissionAccessIdType.Email,
    });

    if (!emailBasedAccessRecords.length) {
      Logger.log('No email-based access records found for user email', { email: user.email });
      return 0;
    }

    Logger.log('Found email-based access records for email', { email: user.email });

    // Update each of those items with a cognito user id access sk instead of email
    const newCognitoSubAccessRecords = emailBasedAccessRecords.map((record) => {
      return {
        ...record,
        sk: getSubmissionAccessSk({
          accessId: user.id,
          accessIdType: SubmissionAccessIdType.CognitoSsoUserId,
        }),
      };
    });

    // Create new access records with cognito user id access sk
    const createNewAccessRecordsResponse = await this.createItems(newCognitoSubAccessRecords);

    Logger.log('Created new access records for cognito user id', {
      createNewAccessRecordsResponse,
      userId: user.id,
    });

    // Delete old email-based access records
    await this.deleteAllItems(emailBasedAccessRecords);
    Logger.log('Deleted old access records for email', { email: user.email });

    return emailBasedAccessRecords.length;
  }

  private async deleteAllItems(itemsToDelete: { pk: string; sk: string }[]): Promise<boolean> {
    const isSuccessful = await this.dynamoDbService.batchWriteItemAll({
      RequestItems: {
        [this.submissionTable]: itemsToDelete.map((item) => ({
          DeleteRequest: {
            Key: marshall({
              pk: item.pk,
              sk: item.sk,
            }),
          },
        })),
      },
    });

    return isSuccessful;
  }

  private async createItems(newItems: { pk: string; sk: string; stageSk: string }[]): Promise<boolean> {
    const isSuccessful = await this.dynamoDbService.batchWriteItemAll({
      RequestItems: {
        [this.submissionTable]: newItems.map((item) => ({
          PutRequest: {
            Item: marshall(item, { removeUndefinedValues: true }),
          },
        })),
      },
    });

    return isSuccessful;
  }

  private async getAllSubmissionAccessRecords(access: SubmissionAccess): Promise<SubmissionAccessDatabaseItem[]> {
    const items = await this.dynamoDbService.queryAllItems<SubmissionAccessDatabaseItem>({
      TableName: this.submissionTable,
      KeyConditionExpression: `sk = :sk`,
      ExpressionAttributeValues: marshall({
        ':sk': getSubmissionAccessSk(access),
      }),
      ProjectionExpression: 'pk, sk, stageSk',
      IndexName: accessStageIndex,
    });

    if (!Array.isArray(items)) {
      return [];
    }

    return items;
  }

  // ready to remove this
  async migrateSubmission(submissionId: string): Promise<SubmissionDetails> {
    const pk = getSubmissionPk(submissionId);
    const sk = getSubmissionDetailsSk(submissionId);

    const item = await this.dynamoDbService.getItem<{ form: Partial<SubmissionDetails> }>({
      TableName: this.submissionTable,
      Key: marshall({
        pk,
        sk,
      }),
      ProjectionExpression: 'form',
    });

    if (!item) {
      throw new Error(`Failed to find submission with id ${submissionId}`);
    }

    if (!item.form) {
      throw new Error('Submission already migrated');
    }

    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    const setStatements: string[] = [];
    const removeStatements = ['form'];

    Object.keys(item.form).forEach((key) => {
      if (item.form[key] !== null) {
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = item.form[key];
        setStatements.push(`#${key} = :${key}`);
      }
    });

    const setExpression = setStatements.length ? `set ${setStatements.join(', ')}` : null;
    const removeExpression = removeStatements.length ? `remove ${removeStatements.join(', ')}` : null;
    const updateExpression = [setExpression, removeExpression].filter((x) => x).join(' ');

    const isSuccessful = await this.dynamoDbService.updateItem({
      TableName: this.submissionTable,
      Key: marshall({
        pk,
        sk,
      }),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      UpdateExpression: updateExpression,
    });

    if (!isSuccessful) {
      throw new Error(`Failed to update submission with id ${submissionId}`);
    }

    return this.getSubmissionDetails(submissionId);
  }

  async getPendingRosterExtractorDataItems(
    interval: { start?: Date; end?: Date } = {}
  ): Promise<RosterExtractorData[]> {
    const { start, end } = interval;

    let expressionAttributeNames: Record<string, string> = {
      '#pk': 'pk',
      '#stage': 'stage',
    };

    let expressionAttributeValues: Record<string, string> = {
      ':pk': ROSTER_EXTRACTOR_DATA_PK,
      ':stage': 'PENDING',
    };

    let keyConditionExpression = '#pk = :pk';
    if (start && end) {
      keyConditionExpression = '#pk = :pk AND #sk BETWEEN :start AND :end';
      expressionAttributeNames = {
        ...expressionAttributeNames,
        '#sk': 'createdDate',
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ':start': start.toISOString(),
        ':end': end.toISOString(),
      };
    } else if (start) {
      keyConditionExpression = '#pk = :pk AND #sk >= :start';
      expressionAttributeNames = {
        ...expressionAttributeNames,
        '#sk': 'createdDate',
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ':start': start.toISOString(),
      };
    } else if (end) {
      keyConditionExpression = '#pk = :pk AND #sk <= :end';
      expressionAttributeNames = {
        ...expressionAttributeNames,
        '#sk': 'createdDate',
      };
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ':end': end.toISOString(),
      };
    }

    const items = await this.dynamoDbService.queryAllItems<RosterExtractorDataDatabaseItem>({
      TableName: this.submissionTable,
      KeyConditionExpression: keyConditionExpression,
      FilterExpression: '#stage = :stage',
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      IndexName: rosterExtractorDataIndex,
    });

    if (!items) {
      throw new Error('Failed to fetch roster extractor data items');
    }

    return items.map(mapRosterExtractorDataFromDatabase);
  }

  async getSubmissionsPendingClosure(
    params: DatabaseQueryParameters = {
      limit: 25,
    }
  ): Promise<DynamoDbPaginated<SubmissionDetails> | null> {
    const queryItemsInput: QueryCommandInput = {
      TableName: this.submissionTable,
      ExpressionAttributeNames: { '#status': 'status', '#name': 'name' },
      ProjectionExpression: submissionDetailsQueryProjection,
      ExclusiveStartKey: params.exclusiveStartKey ? marshall(params.exclusiveStartKey) : undefined,
      Limit: params.limit,
      KeyConditionExpression: `stage = :stage`,
      FilterExpression: 'closeAfterDate <= :now',
      ExpressionAttributeValues: marshall({
        ':stage': SubmissionStage.PendingClosure,
        ':now': new Date().toISOString(),
      }),
      IndexName: internalStageIndex,
      ScanIndexForward: true,
    };

    const queryItemsResponse = await this.dynamoDbService.queryItems<SubmissionDetailsDatabaseItem>(queryItemsInput);

    return {
      items: queryItemsResponse.items.map((item) => mapSubmissionDetailsFromDatabase(item)),
      lastEvaluatedKey: queryItemsResponse.lastEvaluatedKey,
    };
  }
}

function mapSubmissionDetailsToDatabase(details: SubmissionDetails): SubmissionDetailsDatabaseItem {
  const { stage, ...rest } = details;
  const createdDate = rest.createdDate.toISOString();
  return {
    ...rest,
    pk: getSubmissionPk(rest.id),
    sk: getSubmissionDetailsSk(rest.id),
    targetEffectiveDate: rest.targetEffectiveDate?.toISOString(), // this should always be present, but allows us to fix data if it was wiped out
    desiredIndicationReturnDate: rest.desiredIndicationReturnDate?.toISOString(),
    createdDate,
    stageChangeEvents: undefined, // don't allow user to set this
    stageSk: mapSubmissionStageToDetailsStageSk(stage, createdDate),
    stage,
    closeAfterDate: undefined, // don't allow user to set this
  };
}

function mapSubmissionDetailsFromDatabase(databaseItem: SubmissionDetailsDatabaseItem): SubmissionDetails {
  const item = { ...databaseItem };
  delete item.pk;
  delete item.sk;
  delete item.stageSk;

  return {
    ...item,
    id: item.id,
    name: item.name,
    targetEffectiveDate: new Date(item.targetEffectiveDate),
    desiredIndicationReturnDate: item.desiredIndicationReturnDate ? new Date(item.desiredIndicationReturnDate) : null,
    stage: item.stage,
    status: item.status,
    approvalStatus: item.approvalStatus,
    creator: item.creator,
    createdDate: new Date(item.createdDate),
    salesforceOpportunityId: item.salesforceOpportunityId,
    stageChangeEvents: item.stageChangeEvents?.map((e) => ({
      ...e,
      date: new Date(e.date),
    })),
    assignee: item.assignee,
    closeAfterDate: item.closeAfterDate ? new Date(item.closeAfterDate) : null,
  };
}

function mapSubmissionStageToExternal(stage: SubmissionStage): SubmissionDetailsDatabaseItemExternalStage {
  return stage === SubmissionStage.Closed ? SubmissionStage.Closed : SubmissionStage.Open;
}

function mapSubmissionAccessToDatabase(
  submissionId: string,
  access: SubmissionAccess,
  stage: SubmissionStage,
  skSuffix: string
): SubmissionAccessDatabaseItem {
  return {
    pk: getSubmissionPk(submissionId),
    sk: getSubmissionAccessSk(access),
    stageSk: mapSubmissionStageToAccessStageSk(stage, skSuffix),
  };
}

function mapSubmissionStageToDetailsStageSk(
  stage: SubmissionStage,
  suffix: string
): SubmissionDetailsDatabaseItemStageSk {
  return `${stage}#${suffix}`;
}

function mapSubmissionStageToAccessStageSk(
  stage: SubmissionStage,
  suffix: string
): SubmissionAccessDatabaseItemStageSk {
  const externalStage = stage === SubmissionStage.Closed ? SubmissionStage.Closed : SubmissionStage.Open;
  return `${externalStage}#${suffix}`;
}

function mapSubmissionRiskToDatabase(submissionId: string, risk: SubmissionRisk): SubmissionRiskDatabaseItem {
  return {
    ...risk,
    pk: getSubmissionPk(submissionId),
    sk: getSubmissionRiskSk(risk.id),
    retroDate: risk.retroDate?.toISOString(),
    createdDate: risk.createdDate.toISOString(),
  };
}

function mapSubmissionRiskFromDatabase(databaseItem: SubmissionRiskDatabaseItem): SubmissionRisk {
  const item = { ...databaseItem };
  delete item.pk;
  delete item.sk;

  return {
    ...item,
    retroDate: item.retroDate ? new Date(item.retroDate) : null,
    createdDate: new Date(item.createdDate),
  };
}

function mapSubmissionDocumentToDatabase(
  submissionId: string,
  document: SubmissionDocument
): SubmissionDocumentDatabaseItem {
  return {
    ...document,
    pk: getSubmissionPk(submissionId),
    sk: getSubmissionDocumentSk(document.id),
    createdDate: document.createdDate.toISOString(),
  };
}

function mapSubmissionDocumentFromDatabase(databaseItem: SubmissionDocumentDatabaseItem): SubmissionDocument {
  const item = { ...databaseItem };
  delete item.pk;
  delete item.sk;

  return {
    ...item,
    createdDate: new Date(item.createdDate),
  };
}

function mapRosterExtractorDataToDatabase(
  brokerageId: string,
  brokerId: string,
  submissionId: string,
  data: RosterExtractorData
): RosterExtractorDataDatabaseItem {
  return {
    ...data,
    pk: getRosterExtractorDataPk(),
    sk: getRosterExtractorDataSk(brokerageId, brokerId, submissionId),
    stage: 'PENDING',
    createdDate: data.createdDate.toISOString(),
  };
}

function mapRosterExtractorDataFromDatabase(databaseItem: RosterExtractorDataDatabaseItem): RosterExtractorData {
  const item = { ...databaseItem };
  delete item.pk;
  delete item.sk;
  delete item.stage;

  return {
    ...item,
    createdDate: new Date(item.createdDate),
  };
}

function mapSubmissionStageChangeEventToDatabase(stageChangeEvent: StageChangeEvent): StageChangeEventDatabaseItem {
  return {
    ...stageChangeEvent,
    date: stageChangeEvent.date.toISOString(),
  };
}

function mapSubmissionStageChangeEventFromDatabase(databaseItem: StageChangeEventDatabaseItem): StageChangeEvent {
  // no need to delete pk/sk
  return {
    ...databaseItem,
    date: new Date(databaseItem.date),
  };
}

function mapSubmissionDetailsUpdateToDatabase(
  data: Partial<SubmissionDetails>,
  createdDate: Date // required for stageSk
): Partial<SubmissionDetailsDatabaseItem> {
  // TODO figure out why normal clean-deep lib doesn't work
  return cleanDeep(
    {
      ...data,
      targetEffectiveDate: data.targetEffectiveDate?.toISOString(),
      desiredIndicationReturnDate: data.desiredIndicationReturnDate?.toISOString(),
      closeAfterDate: data.closeAfterDate?.toISOString(),
      stageSk: data.stage ? mapSubmissionStageToDetailsStageSk(data.stage, createdDate.toISOString()) : undefined,
    },
    {
      emptyArrays: false,
      emptyObjects: true,
      emptyStrings: true,
      nullValues: false,
      undefinedValues: true,
    }
  );
}

function getSubmissionPk(submissionId: string): SubmissionPk {
  return `${SUBMISSION_PK_PREFIX}#${submissionId}`;
}

// intentionally the same as pk
function getSubmissionDetailsSk(submissionId: string): SubmissionDetailsSk {
  return `${SUBMISSION_DETAILS_SK_PREFIX}#${submissionId}`;
}

function getSubmissionAccessSk(access: SubmissionAccess): SubmissionAccessSk {
  return `${SUBMISSION_ACCESS_SK_PREFIX}#${access.accessIdType}#${access.accessId}`;
}

function getSubmissionRiskSk(riskId: string): SubmissionRiskSk {
  return `${SUBMISSION_RISK_SK_PREFIX}#${riskId}`;
}

function getSubmissionDocumentSk(documentId: string): SubmissionDocumentSk {
  return `${SUBMISSION_DOCUMENT_SK_PREFIX}#${documentId}`;
}

function getRosterExtractorDataPk(): RosterExtractorDataPk {
  return ROSTER_EXTRACTOR_DATA_PK;
}

function getRosterExtractorDataSk(brokerageId: string, brokerId: string, submissionId: string): RosterExtractorDataSk {
  return `${brokerageId}#${brokerId}#${submissionId}`;
}

function sortByCreatedDateAsc(a: { createdDate: string }, b: { createdDate: string }): number {
  return a.createdDate.localeCompare(b.createdDate);
}

function sortByCreatedDateDesc(a: { createdDate: string }, b: { createdDate: string }): number {
  return b.createdDate.localeCompare(a.createdDate);
}

export default DatabaseService;

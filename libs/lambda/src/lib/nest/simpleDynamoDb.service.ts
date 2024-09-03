import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandOutput,
  QueryCommandInput,
  AttributeValue,
  UpdateItemCommand,
  UpdateItemCommandInput,
  GetItemCommandInput,
  GetItemCommand,
  PutItemCommandInput,
  PutItemCommand,
  ScanCommandInput,
  ScanCommandOutput,
  ScanCommand,
  DeleteItemCommandInput,
  DeleteItemCommand,
  BatchWriteItemCommandInput,
  BatchWriteItemCommand,
  WriteRequest,
  BatchGetItemCommandInput,
  BatchGetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getLogStructForError } from '../logger';
import { chunk } from 'lodash';

export type DynamoDbPaginationKey = Record<string, AttributeValue>;
export type DynamoDbPaginated<T> = {
  items: T[];
  lastEvaluatedKey?: Record<string, unknown>;
  totalCount?: number;
};

@Injectable()
// simple ddb helper functions for 80% of use cases
// TODO use the utilities in dynamoDb.ts instead of defining here
export class SimpleDynamoDbService {
  private dynamoDbClient: DynamoDBClient;

  constructor(configService: ConfigService) {
    this.dynamoDbClient = new DynamoDBClient({
      region: configService.getOrThrow<string>('AWS_REGION'),
    });
  }

  async getItem<T>(commandConfig: GetItemCommandInput): Promise<T | null> {
    try {
      const response = await this.dynamoDbClient.send(new GetItemCommand(commandConfig));
      Logger.log('DynamoDb get item response', { response });
      return response.Item ? (unmarshall(response.Item) as T) : null;
    } catch (err) {
      Logger.error('Failed to get item', { commandConfig, err: getLogStructForError(err) });
      return null;
    }
  }

  async batchGetItem<T>(commandConfig: BatchGetItemCommandInput): Promise<T[] | null> {
    try {
      const response = await this.dynamoDbClient.send(new BatchGetItemCommand(commandConfig));
      Logger.log('DynamoDb batch get item response', { response });

      if (!response.Responses) {
        return null;
      }

      const items = Object.keys(response.Responses).reduce((acc, tableName) => {
        // we checked above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tableItems = response.Responses![tableName];
        if (Array.isArray(tableItems)) {
          return [...acc, ...tableItems.map((i) => unmarshall(i) as T)];
        }
        return acc;
      }, [] as T[]);

      return items;
    } catch (err) {
      Logger.error('Failed to batch get item', { commandConfig, err: getLogStructForError(err) });
      return null;
    }
  }

  // use this to fetch single item using an index, not the pk
  async queryItem<T>(commandConfig: QueryCommandInput): Promise<T | null> {
    try {
      const response = await this.dynamoDbClient.send(
        new QueryCommand({
          ...commandConfig,
          Limit: 1,
        })
      );
      Logger.log('DynamoDb query item response', { response });

      if (!Array.isArray(response.Items) || !response.Items[0]) {
        return null;
      }

      return unmarshall(response.Items[0]) as T;
    } catch (err) {
      Logger.error('Failed to query item', { commandConfig, err: getLogStructForError(err) });
      return null;
    }
  }

  async queryItems<T>(commandConfig: QueryCommandInput): Promise<DynamoDbPaginated<T> | null> {
    try {
      const response = await this.dynamoDbClient.send(new QueryCommand(commandConfig));
      Logger.log('DynamoDb query item response', { response });

      if (!Array.isArray(response.Items)) {
        return null;
      }

      return {
        items: response.Items.map((i) => unmarshall(i) as T),
        lastEvaluatedKey: response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : undefined,
      };
    } catch (err) {
      Logger.error('Failed to query items', { commandConfig, err: getLogStructForError(err) });
      return null;
    }
  }

  async queryItemsCount(commandConfig: QueryCommandInput): Promise<{ scannedCount?: number; count?: number } | null> {
    try {
      const response = await this.dynamoDbClient.send(new QueryCommand(commandConfig));
      Logger.log('DynamoDb query item response', { response });

      if (response.$metadata.httpStatusCode !== 200) {
        return null;
      }

      return {
        scannedCount: response.ScannedCount,
        count: response.Count,
      };
    } catch (err) {
      Logger.error('Failed to query items', { commandConfig, err: getLogStructForError(err) });
      return null;
    }
  }

  async putItem(commandConfig: PutItemCommandInput): Promise<boolean> {
    try {
      const response = await this.dynamoDbClient.send(new PutItemCommand(commandConfig));
      Logger.log('DynamoDb put item response', { response });
      // TODO decide whether we need to return the updated item
      return true;
    } catch (err) {
      Logger.error('Failed to put item', { commandConfig, err: getLogStructForError(err) });
      return false;
    }
  }

  async batchWriteItem(commandConfig: BatchWriteItemCommandInput, retryDelay = 0): Promise<boolean> {
    try {
      const response = await this.dynamoDbClient.send(new BatchWriteItemCommand(commandConfig));

      if (response.UnprocessedItems && Object.keys(response.UnprocessedItems).length > 0) {
        Logger.log('DynamoDb batch item response', { response });
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return this.batchWriteItem(commandConfig, retryDelay + 100);
      }

      Logger.log('DynamoDb batch item response', { response });
      return true;
    } catch (err) {
      Logger.error('Failed to batch write item', { commandConfig, err: getLogStructForError(err) });
      return false;
    }
  }

  async batchWriteItemAll(commandConfig: BatchWriteItemCommandInput): Promise<boolean> {
    try {
      if (!commandConfig.RequestItems) {
        return true;
      }

      const flatRequests = Object.keys(commandConfig.RequestItems).reduce((acc, tableName) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const items = commandConfig.RequestItems![tableName];
        return [...acc, ...items.map((i) => ({ tableName, item: i }))];
      }, [] as { tableName: string; item: WriteRequest }[]);

      const chunkedRequests = chunk(flatRequests, 25);

      const results = await Promise.all(
        chunkedRequests.map((chunk) => {
          const chunkedRequest = chunk.reduce((acc, { tableName, item }) => {
            if (!acc[tableName]) {
              acc[tableName] = [];
            }
            acc[tableName].push(item);
            return acc;
          }, {} as Record<string, WriteRequest[]>);

          return this.batchWriteItem({
            RequestItems: chunkedRequest,
          });
        })
      );

      return results.every((r) => r);
    } catch (err) {
      Logger.error('Failed to batch write all items', { commandConfig, err: getLogStructForError(err) });
      return false;
    }
  }

  async updateItem(commandConfig: UpdateItemCommandInput): Promise<boolean> {
    try {
      const response = await this.dynamoDbClient.send(new UpdateItemCommand(commandConfig));
      Logger.log('DynamoDb update item response', { response });
      // TODO decide whether we need to return the updated item
      return true;
    } catch (err) {
      Logger.error('Failed to update item', { commandConfig, err: getLogStructForError(err) });
      return false;
    }
  }

  async query(commandConfig: QueryCommandInput): Promise<QueryCommandOutput | null> {
    try {
      const response = await this.dynamoDbClient.send(new QueryCommand(commandConfig));
      const responseToLog = { ...response, Items: '[REDACTED]' };
      Logger.log('DynamoDb query response', { response: responseToLog });
      return response;
    } catch (err) {
      Logger.error('Failed to execute query', { err: getLogStructForError(err) });
      return null;
    }
  }

  // don't use unless you know what you're doing
  async queryAllItems<T>(commandConfig: QueryCommandInput): Promise<T[] | null> {
    try {
      const items: T[] = [];
      let lastEvaluatedKey: Record<string, AttributeValue> | undefined = undefined;
      do {
        const response: QueryCommandOutput | null = await this.query({
          ...commandConfig,
          ExclusiveStartKey: lastEvaluatedKey,
        });

        if (!response) {
          throw new Error('Failed to query');
        }

        if (response?.Items) {
          items.push(...response.Items.map((item) => unmarshall(item) as T));
        }

        if (response?.LastEvaluatedKey) {
          lastEvaluatedKey = response.LastEvaluatedKey;
        } else {
          // reset it in case it paginated already
          lastEvaluatedKey = undefined;
        }
      } while (lastEvaluatedKey);

      return items;
    } catch (err) {
      Logger.error('Failed to get items', { err: getLogStructForError(err) });
      return null;
    }
  }

  async scan(commandConfig: ScanCommandInput): Promise<ScanCommandOutput | null> {
    try {
      if (!commandConfig.IndexName) {
        throw new Error('Refusing a full-table scan');
      }

      const response = await this.dynamoDbClient.send(new ScanCommand(commandConfig));
      const responseToLog = { ...response, Items: '[REDACTED]' };
      Logger.log('DynamoDb scan response', { response: responseToLog });
      return response;
    } catch (err) {
      Logger.error('Failed to execute scan', { err: getLogStructForError(err) });
      return null;
    }
  }

  async deleteItem(commandConfig: DeleteItemCommandInput): Promise<boolean> {
    try {
      const response = await this.dynamoDbClient.send(new DeleteItemCommand(commandConfig));
      Logger.log('DynamoDb delete item response', { response });
      return response.$metadata.httpStatusCode === 200;
    } catch (err) {
      Logger.error('Failed to delete item', { commandConfig, err: getLogStructForError(err) });
      return false;
    }
  }
}

export function getActorId<T extends { pk: string }>(sub: string): T['pk'] {
  return `ACTOR#${sub}`;
}

export default SimpleDynamoDbService;

import * as qs from 'qs';
import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { AuthorizedCognitoUser } from '@cb-common/data';
import { getLogStructForError } from '@cb-common/lambda';

import { SalesforceContactRecord, SalesforceEmployeeRecord } from './salesforce.dto';
import DocumentService from '../common/document.service';

export type CreateOpportunityFromSubmissionInput = Omit<CreateAppOpportunityInput, 'OwnerId' | 'RecordTypeId'>;
export type CreateTaskInput = Omit<CreateAppTaskInput, 'OwnerId'>;

// while running in a lambda, we can safely cache for max lambda lifetime (15m)
// reconsider if we move to a long-lived server
const cache = new Map<string, AppAccount | AppContact>();
const recordTypeCache = new Map<string, string>();
const agencyOwnerEmailCache = new Map<string, string>();
const getAgenciesCache = new Map<string, SalesforceAccount[]>();
const getAgentsForAgencyCache = new Map<string, SalesforceContact[]>();
const getContactsForAgencyCache = new Map<string, SalesforceContact[]>();
const getAgencyAndContactsByAccountIdCache = new Map<string, SalesforceAccountWithContacts[]>();
const getContactsByEmailCache = new Map<string, SalesforceContact[]>();

type SalesforceAccountWithContacts = SalesforceAccount & { Contacts: { records: SalesforceContactRecord[] } };

type SalesforceOppWithOwnerAndUnderwriter = SalesforceOpportunity & {
  Owner: SalesforceUser;
  Underwriter_MMIC__r: SalesforceEmployeeRecord;
};

export type SalesforceOppWithAgency = SalesforceOpportunity & {
  Appointed_Agency__r: SalesforceAccount;
};

type SalesforceCaseWithContactAndAgencyDetails = SalesforceCase & {
  Contact: SalesforceContact;
  Prospect_Account_Group__r: SalesforceAccount;
  Agency__r: SalesforceAccount;
  CombinedAttachments?: {
    records: { Id: string }[];
  } | null;
  EmailMessages?: {
    records: { Id: string }[];
  } | null;
};

type SalesforceEmailMessageWithAttachments = SalesforceEmailMessage & {
  CombinedAttachments?: {
    records: { Id: string }[];
  } | null;
};

type UnderwriterUserInfoForAssignment = {
  email: string;
  firstName: string;
  lastName: string;
};

type CacheKeyArgs = {
  fields: string[];
  email?: string;
  salesforceAgencyId?: string;
  salesforceContactId?: string;
};

@Injectable()
export class SalesforceService {
  private defaultOwnerId: string | null = null;

  constructor(
    @Inject('SALESFORCE_CLIENT') private readonly salesforceClient: SalesforceClient,
    private readonly documentService: DocumentService
  ) {}

  searchAccountsByName<T>(query: string, recordType?: string, fields: string[] = ['id', 'name'], limit?: number) {
    const where = recordType ? `RecordType.name='${recordType}'` : undefined;
    return this.searchByName<T>(SalesforceResource.Account, query, where, fields, limit);
  }

  searchContactsByName<T>(query: string, recordType?: string, fields: string[] = ['id', 'name'], limit?: number) {
    const where = recordType ? `RecordType.name='${recordType}'` : undefined;
    return this.searchByName<T>(SalesforceResource.Contact, query, where, fields, limit);
  }

  private searchByName<T>(
    resource: SalesforceResource,
    query: string,
    where?: string,
    fields: string[] = ['id', 'name'],
    limit?: number
  ) {
    const fieldsKey = `${resource}.fields`;
    const limitKey = `${resource}.limit`;
    const whereKey = `${resource}.where`;

    const soql: Record<string, string | number> = {
      sobject: resource,
      in: 'NAME',
      [fieldsKey]: fields.join(','),
      q: query,
    };

    if (limit) {
      soql[limitKey] = limit;
    }

    // only supporting a single record type for now, extend later if necessary
    if (where) {
      soql[whereKey] = where;
    }

    Logger.log('Searching salesforce by name', { query, resource, where, fields, limit, soql });
    return this.salesforceClient.parameterizedSearch<T>(qs.stringify(soql));
  }

  getSalesforceInstanceUrl(): string {
    return this.salesforceClient.getInstanceUrl();
  }

  async getAgencies(fields: string[] = ['id', 'name']) {
    const cacheKey = getFormattedCacheKey({ fields });
    const cachedValue = getAgenciesCache.get(cacheKey);
    if (cachedValue) {
      return cachedValue;
    }

    const where = `RecordTypeId in (select id from RecordType where name = 'Agency') AND (Type = 'Agency' OR Type = 'Agency-Prospect')`;

    const res = await this.salesforceClient.getObjects<SalesforceAccount>(SalesforceResource.Account, fields, where);
    getAgenciesCache.set(cacheKey, res);
    return res;
  }

  async getContactsByEmail(email: string, fields: string[] = ['id', 'name']) {
    const cacheKey = getFormattedCacheKey({ fields, email });
    const cachedValue = getContactsByEmailCache.get(cacheKey);
    if (cachedValue) {
      return cachedValue;
    }

    const where = `Email = '${email}'`;
    const res = await this.salesforceClient.getObjects<SalesforceContact>(SalesforceResource.Contact, fields, where);

    getContactsByEmailCache.set(cacheKey, res);
    return res;
  }

  async getAgentsForAgency(salesforceAgencyId: string, fields: string[] = ['id', 'name']) {
    const cacheKey = getFormattedCacheKey({ fields, salesforceAgencyId });
    const cachedValue = getAgentsForAgencyCache.get(cacheKey);
    if (cachedValue) {
      return cachedValue;
    }
    const where = `RecordTypeId in (select id from RecordType where name = 'Agent') AND AccountId = '${salesforceAgencyId}' AND Email != null`;
    const res = await this.salesforceClient.getObjects<SalesforceContact>(SalesforceResource.Contact, fields, where);

    getAgentsForAgencyCache.set(cacheKey, res);
    return res;
  }

  async getContactsForAgency(salesforceAgencyId: string, fields: string[] = ['id', 'name']) {
    const cacheKey = getFormattedCacheKey({ fields, salesforceAgencyId });
    const cachedValue = getContactsForAgencyCache.get(cacheKey);
    if (cachedValue) {
      return cachedValue;
    }
    const where = `AccountId = '${salesforceAgencyId}'`;
    const res = await this.salesforceClient.getObjects<SalesforceContact>(SalesforceResource.Contact, fields, where);

    getContactsForAgencyCache.set(cacheKey, res);
    return res;
  }

  async getAgencyAndContactsByAccountId(agencySalesforceId: string) {
    const cachedValue = getAgencyAndContactsByAccountIdCache.get(agencySalesforceId);
    if (cachedValue) {
      return cachedValue;
    }

    const fields = ['Id', 'Name', '(select Id, Name, Email, RecordType.Name from Contacts)'];
    const where = `Id = '${agencySalesforceId}'`;

    const res = await this.salesforceClient.getObjects<SalesforceAccountWithContacts>(
      SalesforceResource.Account,
      fields,
      where
    );

    getAgencyAndContactsByAccountIdCache.set(agencySalesforceId, res);
    return res;
  }

  getOpportunityWithUnderwriter(opportunityId: string): Promise<SalesforceOppWithOwnerAndUnderwriter> {
    const fields = [
      'Id',
      'Name',
      'Underwriter_MMIC__r.Employee_Email__c',
      'Underwriter_MMIC__r.First_Name__c',
      'Underwriter_MMIC__r.Last_Name__c',
    ].join(',');

    return this.salesforceClient.getObjectById<SalesforceOppWithOwnerAndUnderwriter>(
      SalesforceResource.Opportunity,
      opportunityId,
      fields
    );
  }

  async getUnderwriterUserByOpportunityId(opportunityId: string): Promise<UnderwriterUserInfoForAssignment> {
    // Get the underwriter user info from the opportunity
    const responseData = await this.getOpportunityWithUnderwriter(opportunityId);

    if (!responseData?.Underwriter_MMIC__r) {
      Logger.error('Failed to find underwriter on opportunity', { opportunityId });
      throw new NotFoundException('No underwriter found for opportunity');
    }

    return {
      email: responseData.Underwriter_MMIC__r.Employee_Email__c,
      firstName: responseData.Underwriter_MMIC__r.First_Name__c,
      lastName: responseData.Underwriter_MMIC__r.Last_Name__c,
    };
  }

  async getDuplicateOpportunities(salesforceAccountId: string): Promise<SalesforceOppWithAgency[]> {
    // Get open MedMal Opps for the account to check for duplicates.  Populate the Agency Name from the agency lookup field too.
    const fields = [
      'Id',
      'AccountId',
      'Appointed_Agency__r.Id',
      'Appointed_Agency__r.Name',
      'IsClosed',
      'Name',
      'StageName',
      'State__c',
      'Target_Effective_Date__c',
      'Type',
    ].join(',');

    // Adjusted where clause to directly use the provided accountId
    const where = `AccountId = '${salesforceAccountId}' AND IsClosed = false AND RecordTypeId in (select id from RecordType where name = 'MedMal')`;

    const res = await this.salesforceClient.getObjects<SalesforceOppWithAgency>(
      SalesforceResource.Opportunity,
      fields,
      where
    );

    if (res.length > 0) {
      Logger.log('Found duplicate opportunities', { res });
      return res;
    }

    Logger.log('No duplicate opportunities found');
    return [];
  }

  async getAgencyDataByContactEmail(email: string) {
    // Query Salesforce for contacts with given email
    const contactRes = await this.getContactsByEmail(email, ['id', 'name', 'accountId']);

    // Throw an error if no contact found
    if (contactRes.length === 0) {
      Logger.error('Did not find Salesforce contact with email', { email });
      throw new NotFoundException('No contact found with given email');
    }

    // Throw an error if duplicate contacts found
    if (contactRes.length > 1) {
      Logger.error('Found Duplicate contacts with email', { email });
      throw new ForbiddenException('Account update needed. Duplicate contacts found with given email.');
    }

    Logger.log('Found Salesforce contact with email', { email });

    const agencyWithContactsRes = await this.getAgencyAndContactsByAccountId(contactRes[0].AccountId);
    const contactData = agencyWithContactsRes[0].Contacts.records.map(
      ({ Id, Name, AccountId, Email, RecordType: { Name: RecordTypeName } }) => ({
        id: Id,
        name: Name,
        accountId: AccountId,
        recordType: RecordTypeName,
        email: Email,
      })
    );

    // Construct agency data for response
    const agencyData = {
      id: agencyWithContactsRes[0].Id,
      name: agencyWithContactsRes[0].Name,
      agents: contactData.filter((contact) => contact.recordType === 'Agent' && contact.email),
      submitter: contactData.find((contact) => contact.id === contactRes[0].Id),
    };

    // Check to make sure agency has at least one agent
    if (agencyData.agents.length === 0) {
      Logger.error('No agents found for agency', { agencyId: agencyData.id, agencyName: agencyData.name });
      throw new NotFoundException('No agents found for agency');
    }

    return agencyData;
  }

  async createProspectAccount(name: string): Promise<string | null> {
    const createAccountInput = newAccountToSalesforce({
      Name: name,
      Type: 'Prospect',
      OwnerId: await this.getDefaultOwnerId(),
    });
    Logger.log('Creating new Salesforce account', { createAccountInput });

    const salesforceAccountId = await this.salesforceClient.createObject(
      SalesforceResource.Account,
      createAccountInput
    );
    Logger.log('Created new Salesforce account', { salesforceAccountId });

    return salesforceAccountId;
  }

  async getAccountById(id: string): Promise<AppAccount | null> {
    if (cache.has(id)) {
      Logger.log('Returning cached Salesforce account', { id });
      return cache.get(id) as AppAccount;
    }

    Logger.log('Looking up Salesforce account', { id });

    const salesforceAccount = await this.salesforceClient.getObjectById<SalesforceAccount>(
      SalesforceResource.Account,
      id,
      'Id,Name' // add more fields as we need them
    );

    if (!salesforceAccount) {
      Logger.error('Failed to find Salesforce account', { id });
      return null;
    }

    Logger.log('Found Salesforce account', { salesforceAccount });

    const appAccount = accountFromSalesforce(salesforceAccount);
    cache.set(appAccount.Id, appAccount);

    return appAccount;
  }

  async getContactById(id: string): Promise<AppContact | null> {
    if (cache.has(id)) {
      Logger.log('Returning cached Salesforce contact', { id });
      return cache.get(id) as AppContact;
    }

    Logger.log('Looking up Salesforce contact', { id });

    const salesforceContact = await this.salesforceClient.getObjectById<SalesforceContact>(
      SalesforceResource.Contact,
      id,
      'Id,Name,Email,FirstName,LastName' // add more fields as we need them
    );

    if (!salesforceContact) {
      Logger.error('Failed to find Salesforce contact', { id });
      return null;
    }

    Logger.log('Found Salesforce contact', { salesforceContact });

    const appContact = contactFromSalesforce(salesforceContact);
    cache.set(appContact.Id, appContact);

    return appContact;
  }

  async getAgencyOwnerEmail(agencySalesforceId: string): Promise<string | null> {
    const cachedValue = agencyOwnerEmailCache.get(agencySalesforceId);
    if (cachedValue) {
      return cachedValue;
    }

    const user = await this.salesforceClient.getObjects<SalesforceUser>(
      SalesforceResource.User,
      ['Id', 'Email'],
      `Id in (select OwnerId from Account where Id = '${agencySalesforceId}')`
    );

    const email = user[0]?.Email; // Assumes only one user is returned

    if (email) {
      agencyOwnerEmailCache.set(agencySalesforceId, email);
      return email;
    }

    return null;
  }

  async createOpportunityFromSubmission(
    opportunityInput: CreateOpportunityFromSubmissionInput
  ): Promise<string | null> {
    const [ownerId, recordTypeId] = await Promise.all([this.getDefaultOwnerId(), this.getRecordTypeIdByName('MedMal')]);

    const createOpportunityInput = newOpportunityToSalesforce({
      ...opportunityInput,
      OwnerId: ownerId,
      RecordTypeId: recordTypeId,
    });
    Logger.log('Creating new Salesforce opportunity', { createOpportunityInput });

    const salesforceOpportunityId = await this.salesforceClient.createObject(
      SalesforceResource.Opportunity,
      createOpportunityInput
    );
    Logger.log('Created new Salesforce opportunity', { salesforceOpportunityId });

    return salesforceOpportunityId;
  }

  async createTask(taskInput: CreateTaskInput): Promise<string>;
  async createTask(taskInput: CreateTaskInput[]): Promise<string[]>;
  async createTask(taskInput: CreateTaskInput | CreateTaskInput[]): Promise<string | string[]> {
    const ownerId = await this.getDefaultOwnerId();

    if (Array.isArray(taskInput)) {
      const createTasksInput = taskInput.map((ti) => newTaskToSalesforce({ ...ti, OwnerId: ownerId }));
      Logger.log('Creating new Salesforce tasks', { createTasksInput });

      const salesforceTaskIds = await this.salesforceClient.createObject(SalesforceResource.Task, createTasksInput);
      Logger.log('Created new Salesforce tasks', { salesforceTaskIds });

      return salesforceTaskIds;
    }

    const createTaskInput = newTaskToSalesforce({ ...taskInput, OwnerId: ownerId });
    Logger.log('Creating new Salesforce task', { createTaskInput });

    const salesforceTaskId = await this.salesforceClient.createObject(SalesforceResource.Task, createTaskInput);
    Logger.log('Created new Salesforce task', { salesforceTaskId });

    return salesforceTaskId;
  }

  delete(resourceName: SalesforceResource, id: string): Promise<boolean> {
    return this.salesforceClient.delete(resourceName, id);
  }

  private async getDefaultOwnerId(): Promise<string> {
    if (this.defaultOwnerId) {
      return this.defaultOwnerId;
    }

    const salesforceIdentity = await this.salesforceClient.getIdentity();
    this.defaultOwnerId = salesforceIdentity.user_id;
    return this.defaultOwnerId;
  }

  private async getRecordTypeIdByName(name: string): Promise<string | null> {
    const cachedValue = recordTypeCache.get(name);
    if (cachedValue) {
      return cachedValue;
    }

    const recordTypes = await this.salesforceClient.getObjects<SalesforceRecordType>(SalesforceResource.RecordType, [
      'id',
      'name',
    ]);
    if (!Array.isArray(recordTypes)) {
      Logger.error('Failed to get record types from Salesforce', { recordTypes });
      return null;
    }

    recordTypes.forEach((recordType) => recordTypeCache.set(recordType.Name, recordType.Id));
    return recordTypeCache.get(name) || null;
  }

  getDeclineReasonBizDevOptions(): SalesforceOpportunity['Decline_Reason_BizDev__c'][] {
    // TODO: * hard-coded values */ NOTE: Need to make these more dynamic.  Possibly by updating the generator to make another type for them.
    const reasons: SalesforceOpportunity['Decline_Reason_BizDev__c'][] = [
      "Couldn't Reach Consensus",
      'Geographic Limitations',
      'Higher Limits',
      'Losses/Pending Claims',
      'Not Rated',
      'Policy Form',
      'Political',
      'Practice Profile',
      'Pricing too high',
      'Broker of Record',
      'Current Customer',
    ];

    return reasons;
  }

  private async getCaseById(id: string): Promise<SalesforceCaseWithContactAndAgencyDetails | null> {
    Logger.log('Looking up Salesforce case', { id });
    const fields = [
      'Id',
      'Subject',
      'Description',
      'Agency__c',
      'Agency__r.Name',
      'ContactId',
      'Contact.Name',
      'Expiring_Med_Mal_Premium__c',
      'Claims__c',
      'Prospect_Account_Group__c',
      'Prospect_Account_Group__r.Name',
      'Network__c',
      'Policy_Issue_State_s2__c',
      'Policy_Type__c',
      'Target_Effective_Date__c',
      'Type',
      'IsClosed',
      '(select Id from CombinedAttachments)',
      '(select Id from EmailMessages)',
    ].join(',');

    const caseRes = await this.salesforceClient.getObjectById<SalesforceCaseWithContactAndAgencyDetails>(
      SalesforceResource.Case,
      id,
      fields
    );

    return caseRes || null;
  }

  async updateCaseUponSimSubmissionById(id: string): Promise<boolean> {
    Logger.log('Updating Salesforce case', { id });
    // Just update the status to "Closed - Handle in SIM"
    const updateCaseInput = {
      Id: id,
      Status: 'Closed - Handle in SIM',
    } as const;

    const updateCaseRes = await this.salesforceClient.updateObject<SalesforceCase>(
      SalesforceResource.Case,
      updateCaseInput
    );

    if (updateCaseRes) {
      Logger.log('Updated Salesforce case', { id });
      return true;
    }

    return false;
  }

  async getSubmissionDetailsFromCaseId(
    id: string,
    user: AuthorizedCognitoUser
  ): Promise<{ details: SubmissionDetailsFromCase; documents: NewSubmissionDocument[] } | null> {
    const salesforceCase = await this.getCaseById(id);

    if (!salesforceCase) {
      Logger.error('Failed to fetch Salesforce case', { id });
      return null;
    }

    // Validate the case is a submission and not already closed
    if (salesforceCase.Type !== 'Submission') {
      Logger.error('Salesforce case is not of type "Submission"', { id });
      throw new BadRequestException('Salesforce case is not of type "Submission"');
    }

    if (salesforceCase.IsClosed) {
      Logger.error('Salesforce case is already closed', { id });
      throw new BadRequestException('Salesforce case is already closed');
    }

    Logger.log('Found Salesforce case', { salesforceCase });

    const appCase = caseFromSalesforce(salesforceCase);
    const salesforceProspectAccountGroupRecord =
      appCase.Prospect_Account_Group__c && accountFromSalesforce(salesforceCase.Prospect_Account_Group__r);
    const salesforceContactRecord = appCase.ContactId && contactFromSalesforce(salesforceCase.Contact);
    const salesforceAgencyRecord = appCase.Agency__c && accountFromSalesforce(salesforceCase.Agency__r);

    // Use that case data and map whatever we can to the Submission Details data structure
    const submissionDetails: SubmissionDetailsFromCase = {
      salesforceCaseId: appCase.Id,
      salesforceAccountId: appCase.Prospect_Account_Group__c,
      salesforceAccountName: salesforceProspectAccountGroupRecord?.Name,
      brokerCommentsAndPracticeDescription: `${appCase.Subject} \r\n${appCase.Description}`,
      salesforceAgentSubmitterId: appCase.ContactId,
      salesforceAgencyId: appCase.Agency__c,
      claims: appCase.Claims__c,
      expiringPremium: Number(appCase.Expiring_Med_Mal_Premium__c),
      network: appCase.Network__c,
      policyTypes: appCase.Policy_Type__c && convertToPolicyTypeCodes(appCase.Policy_Type__c),
      stateCodes: appCase.Policy_Issue_State_s2__c as StateCode[],
      salesforceAgentSubmitterName: salesforceContactRecord?.Name,
      salesforceAgencyName: salesforceAgencyRecord?.Name,
      targetEffectiveDate: appCase.Target_Effective_Date__c
        ? bareDateToLocalDate(appCase.Target_Effective_Date__c)
        : undefined,
    };

    const documents = await this.copyCaseAttachmentsToWip(salesforceCase, user);

    return {
      details: submissionDetails,
      documents,
    };
  }

  private async copyCaseAttachmentsToWip(
    salesforceCase: SalesforceCaseWithContactAndAgencyDetails,
    user: AuthorizedCognitoUser
  ): Promise<NewSubmissionDocument[]> {
    const contentDocumentIds = (salesforceCase.CombinedAttachments?.records || []).map((record) => record.Id);

    if (Array.isArray(salesforceCase.EmailMessages?.records)) {
      const emailMessageIds = salesforceCase.EmailMessages.records.map((record) => `'${record.Id}'`).join(',');
      const emailMessages: SalesforceEmailMessageWithAttachments[] = await this.salesforceClient.getObjects(
        SalesforceResource.EmailMessage,
        [`(select Id from CombinedAttachments)`],
        `Id in (${emailMessageIds})`
      );

      if (Array.isArray(emailMessages)) {
        emailMessages.forEach((em) => {
          if (Array.isArray(em.CombinedAttachments?.records)) {
            contentDocumentIds.push(...em.CombinedAttachments.records.map((record) => record.Id));
          }
        });
      }
    }

    const contentDocumentFields = ['Id', 'Title', 'FileExtension', 'LatestPublishedVersionId'].join(',');
    const promises = contentDocumentIds.map(async (contentDocumentId) => {
      const contentDocument = await this.salesforceClient.getObjectById<SalesforceContentDocument>(
        SalesforceResource.ContentDocument,
        contentDocumentId,
        contentDocumentFields
      );

      const { Title, FileExtension, LatestPublishedVersionId } = contentDocument;
      const name = `${Title}.${FileExtension}`;
      const type = UploadableFileType.AdditionalDocument;

      const stream = await this.salesforceClient.streamContentVersion(LatestPublishedVersionId);

      const { id, key } = await this.documentService.uploadObject(
        stream,
        {
          name,
          type,
        },
        user.id
      );

      return { id, name, key, type };
    });

    return Promise.all(promises);
  }
}

function convertToPolicyTypeCodes(salesforcePolicyTypes: string[]): PolicyCode[] {
  // go through each policy type and convert to our policy code
  return salesforcePolicyTypes
    .map((policyType) => {
      switch (policyType) {
        case 'Claims Made':
          return PolicyCode.ClaimsMade;
        case 'Claims Made Plus':
          return PolicyCode.ClaimsMadePlus;
        case 'Occurrence':
          return PolicyCode.Occurrence;
        default:
          return null;
      }
    })
    .filter((policyType) => Boolean(policyType));
}

function getFormattedCacheKey({ fields, email, salesforceAgencyId, salesforceContactId }: CacheKeyArgs): string {
  const formattedFields = fields.sort().join('.');

  return `${email}#${salesforceAgencyId}#${salesforceContactId}#${formattedFields}`;
}

// need more thought on how we handle dates without timezone, but this is sufficient for now
function bareDateToLocalDate(date: Date): Date | null {
  try {
    const [year, month, day] = date.toJSON().split('T')[0].split('-');
    return new Date(`${month}/${day}/${year}`);
  } catch (err) {
    Logger.error('Failed to convert date', { date, err: getLogStructForError(err) });
    return null;
  }
}

export default SalesforceService;

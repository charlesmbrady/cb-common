import { Readable } from 'stream';
import * as jsforce from 'jsforce';
import * as jwt from 'jsonwebtoken';
import * as qs from 'qs';
import axios from 'axios';

import { AtLeast, HealthCheckable } from '@cb-common/data';
import { getLogger, getLogStructForError } from '@cb-common/lambda';

import { CreateSalesforceObjectInput, SalesforceObject, SalesforcePolicy, SalesforceResource } from './generated';
import { SalesforceClientArgs, SalesforceSearchResponse } from './types';

const logger = getLogger();

export class SalesforceClient implements HealthCheckable {
  private connection: jsforce.Connection;
  private config: SalesforceClientArgs;

  constructor(config: SalesforceClientArgs) {
    this.config = config;
  }

  async healthCheck(): Promise<boolean> {
    try {
      logger.info('SalesforceClient healthCheck start');

      const connection = await this.getConnection();
      const response = await connection.describe('Opportunity');
      if (!response) {
        throw new Error('Failed to describe object');
      }

      logger.info('SalesforceClient healthCheck success');
      return true;
    } catch (err) {
      logger.info('SalesforceClient healthCheck error', { err: getLogStructForError(err) });
      return false;
    }
  }

  getInstanceUrl(): string {
    return this.connection.instanceUrl;
  }

  private async getConnection(): Promise<jsforce.Connection> {
    const { auth } = this.config;

    if (this.connection) {
      logger.info('Using cached salesforce connection');
      return this.connection;
    }

    logger.info('Creating new salesforce connection');
    const token = jwt.sign({}, auth.certKey, {
      algorithm: 'RS256',
      subject: auth.subject,
      audience: auth.domain,
      issuer: auth.clientId,
      expiresIn: '2 minutes',
    });

    const params = {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    };

    const { data } = await axios.post(`${auth.domain}/services/oauth2/token`, qs.stringify(params));
    this.connection = new jsforce.Connection({
      instanceUrl: data.instance_url,
      accessToken: data.access_token,
    });

    logger.info('Successfully created salesforce connection');
    return this.connection;
  }

  async getIdentity(): Promise<jsforce.IdentityInfo> {
    const connection = await this.getConnection();
    return connection.identity();
  }

  async getObjectById<T extends SalesforceObject>(
    resourceName: SalesforceResource,
    id: string,
    select = '*'
  ): Promise<jsforce.Record<T> | null> {
    try {
      const connection = await this.getConnection();
      // not using .retrieve(id) because it doesn't support `select`
      const response = await connection.sobject(resourceName).findOne<T>({ Id: id }).select(select).execute();

      logger.info('Salesforce get salesforce resource by id response', { id, response });
      return response || null;
    } catch (err) {
      logger.error('Failed to get salesforce resource by id', { id, err: getLogStructForError(err) });
      return null;
    }
  }

  async getObjects<T extends SalesforceObject>(
    resourceName: SalesforceResource,
    select: string | string[] | Record<string, string | number> = '*',
    where?: string | Record<string, string | number>
  ) {
    try {
      const connection = await this.getConnection();
      const query = connection.sobject(resourceName).find<T>().select(select);

      if (where) {
        query.where(where);
      }

      const response = await query.execute();
      logger.info('Salesforce get salesforce resources', { resourceName, select, where, count: response.length });
      return response || null;
    } catch (err) {
      logger.error('Failed to get salesforce resources', {
        resourceName,
        select,
        where,
        err: getLogStructForError(err),
      });
      return null;
    }
  }

  async getPolicyByPolicyId(policyId: string): Promise<jsforce.Record<SalesforcePolicy> | null> {
    try {
      const connection = await this.getConnection();
      const response = await connection
        .sobject(SalesforceResource.Policy)
        .findOne<SalesforcePolicy>({ Policy_Number__c: policyId })
        .execute();

      logger.info('Salesforce policy response', { policyId, response });
      return response || null;
    } catch (err) {
      logger.error('Failed to get salesforce policy by id', { policyId, err: getLogStructForError(err) });
      return null;
    }
  }

  async queryObject<T extends SalesforceObject>(
    resourceName: SalesforceResource,
    conditions: Record<keyof T, string | number>
  ): Promise<jsforce.Record<T>[] | null> {
    try {
      const connection = await this.getConnection();
      const response = await connection.sobject(resourceName).find<T>(conditions).execute();

      logger.info('Salesforce query salesforce resource response', { resourceName, conditions, response });
      return response || null;
    } catch (err) {
      logger.error('Failed to query salesforce resource', { resourceName, conditions, err: getLogStructForError(err) });
      return null;
    }
  }

  async createObject(resourceName: SalesforceResource, input: CreateSalesforceObjectInput): Promise<string | null>;
  async createObject(resourceName: SalesforceResource, input: CreateSalesforceObjectInput[]): Promise<string[] | null>;
  async createObject(
    resourceName: SalesforceResource,
    input: CreateSalesforceObjectInput | CreateSalesforceObjectInput[]
  ): Promise<string | string[] | null> {
    try {
      const connection = await this.getConnection();
      const response = await connection.sobject(resourceName).create(input, { allOrNone: true });

      // an error should be thrown if the object wasn't created, but just in case
      if (
        (Array.isArray(response) && response.some((r) => !r.success)) ||
        (!Array.isArray(response) && !response.success)
      ) {
        logger.error('Unexpected failure creating salesforce object', { resourceName, input, response });
        throw new Error('Unexpected failure creating salesforce object');
      }

      logger.info('Salesforce create salesforce object response', { resourceName, input, response });

      if (Array.isArray(response)) {
        return response.map((r) => r.id);
      }
      return response.id;
    } catch (err) {
      logger.error('Failed to create salesforce object', { resourceName, input, err: getLogStructForError(err) });
      return null;
    }
  }

  async updateObject<T extends SalesforceObject>(
    resourceName: SalesforceResource,
    input: AtLeast<T, 'Id'>
  ): Promise<string | null> {
    try {
      const connection = await this.getConnection();
      const [response] = await connection.sobject<T>(resourceName).update([input]);

      // an error should be thrown if the object wasn't updated, but just in case...
      if (!response.success || !response.id) {
        logger.error('Unexpected failure updating salesforce object', { resourceName, input, response });
        throw new Error('Unexpected failure updating salesforce object');
      }

      logger.info('Salesforce update salesforce object response', { resourceName, input, response });
      return response.id;
    } catch (err) {
      logger.error('Failed to update salesforce object', { resourceName, input, err: getLogStructForError(err) });
      return null;
    }
  }

  async parameterizedSearch<T>(sosl: string) {
    try {
      const connection = await this.getConnection();
      // connection doesn't have parameterizedSearch implemented, need to do ourselves
      const res = await connection.request<SalesforceSearchResponse<T>>({
        url: `${connection.instanceUrl}/services/data/v${connection.version}/parameterizedSearch/?${sosl}`,
      });
      return res.searchRecords;
    } catch (err) {
      logger.error('Failed to execute paramaterized search in salesforce', { err: getLogStructForError(err) });
      return null;
    }
  }

  async describe(type: string) {
    try {
      const connection = await this.getConnection();
      return connection.describe(type);
    } catch (err) {
      logger.error('Failed to run salesforce describe', { err: getLogStructForError(err) });
      return null;
    }
  }

  async delete(resourceName: SalesforceResource, id: string): Promise<boolean> {
    try {
      const connection = await this.getConnection();
      const res = await connection.sobject(resourceName).delete(id);
      return res.success;
    } catch (err) {
      logger.error('Failed to delete salesforce object', { err: getLogStructForError(err) });
      return false;
    }
  }

  async streamContentVersion(contentVersionId: string): Promise<Readable> {
    const connection = await this.getConnection();
    const response = await axios.get(
      `${connection.instanceUrl}/services/data/v${connection.version}/sobjects/ContentVersion/${contentVersionId}/VersionData`,
      {
        headers: {
          Authorization: `Bearer ${connection.accessToken}`,
        },
        responseType: 'stream',
      }
    );

    return response.data;
  }
}

export default SalesforceClient;

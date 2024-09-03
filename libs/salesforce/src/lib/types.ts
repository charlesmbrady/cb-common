import { SalesforceResource } from './generated';

export type SalesforceObjectAttributes<T> = T & {
  attributes: {
    type: SalesforceResource;
    url: string;
  };
};

export type SalesforceSearchResponse<T> = {
  searchRecords: SalesforceObjectAttributes<T>[];
};

export type SalesforceClientArgs = {
  auth: {
    certKey: string;
    subject: string;
    domain: string;
    clientId: string;
  };
};

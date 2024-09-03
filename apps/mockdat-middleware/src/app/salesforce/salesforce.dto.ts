import { JOI_SALESFORCE_ID } from '@cb-common/data';
import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

export type SalesforceBaseRecord = {
  Id: string;
  Name: string;
};

export type SalesforceContactRecord = SalesforceBaseRecord & {
  AccountId?: string;
  Email?: string;
  RecordType: { Name: string };
};

export type SalesforceOpportunityRecord = SalesforceBaseRecord & {
  AccountId?: string;
  Agency__r?: SalesforceBaseRecord;
  IsClosed?: boolean;
  StageName?: string;
  State__c?: string;
  Target_Effective_Date__c?: string;
  Type?: string;
};

export type SalesforceEmployeeRecord = SalesforceBaseRecord & {
  Employee_Email__c?: string;
  First_Name__c?: string;
  Last_Name__c?: string;
};

export class SalesforceSearchParams {
  q: string;
  limit?: number;
}

export const SalesforceSearchParamsSchema = Joi.object<SalesforceSearchParams>({
  q: Joi.string().required().trim().min(2),
  limit: Joi.number().optional().min(1),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

@Injectable()
export class SalesforceSearchParamsValidator implements PipeTransform<SalesforceSearchParams> {
  transform(value: SalesforceSearchParams) {
    const result = SalesforceSearchParamsSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      Logger.error('SalesforceSearchParamsValidator failed', { errorMessages });
      throw new BadRequestException(errorMessages);
    }

    return result.value;
  }
}

@Injectable()
export class SalesforceObjectIdValidator implements PipeTransform<string> {
  transform(value: string) {
    const result = JOI_SALESFORCE_ID.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      Logger.error('SalesforceObjectIdValidator failed', { errorMessages });
      throw new BadRequestException(errorMessages);
    }

    return result.value;
  }
}

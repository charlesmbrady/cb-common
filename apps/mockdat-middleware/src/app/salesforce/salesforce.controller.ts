import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { UserRole } from '@cb-common/data';
import { getCurrentUser, getLogStructForError, JoiValidationPipe, Roles } from '@cb-common/lambda';

import { SalesforceOppWithAgency, SalesforceService } from './salesforce.service';
import {
  SalesforceBaseRecord,
  SalesforceContactRecord,
  SalesforceObjectIdValidator,
  SalesforceSearchParams,
  SalesforceSearchParamsValidator,
} from './salesforce.dto';


@Controller('salesforce')
export class SalesforceController {
  constructor(private readonly salesforceService: SalesforceService) {}

  @Get('/search/accounts')
  @Roles(UserRole.Internal)
  async searchAccounts(
    @Query(SalesforceSearchParamsValidator) searchParams: SalesforceSearchParams
  ): Promise<any> {
    const { q, limit } = searchParams;

    const res = await this.salesforceService.searchAccountsByName<SalesforceBaseRecord>(
      q,
      'Account - Customer',
      ['id', 'name'],
      limit
    );

    return {
      status: 'ok',
      data: {
        results: mapSalesforceRecordsForResponse(res),
      },
    };
  }

  @Get('/agencies/me')
  @Roles(UserRole.Internal, UserRole.AgencyAdmin)
  async getAgencyDataForUser(): Promise<GetSalesforceAgencyDataResponse> {
    const user = getCurrentUser();
    const agencyData = await this.salesforceService.getAgencyDataByContactEmail(user.email);

    return {
      status: 'ok',
      data: agencyData,
    };
  }

  @Get('/agencies')
  @Roles(UserRole.Internal)
  async getAgencies(): Promise<GetSalesforceAgenciesResponse> {
    const res = await this.salesforceService.getAgencies();

    return {
      status: 'ok',
      data: mapSalesforceRecordsForResponse(res as SalesforceBaseRecord[]),
    };
  }

  @Get('/agencies/:salesforceId/agents')
  @Roles(UserRole.Internal)
  async searchAgents(
    @Param('salesforceId', SalesforceObjectIdValidator) salesforceId: string
  ): Promise<GetSalesforceAgentsResponse> {
    try {
      const res = await this.salesforceService.getAgentsForAgency(salesforceId);

      return {
        status: 'ok',
        data: mapSalesforceRecordsForResponse(res),
      };
    } catch (err) {
      Logger.error('Failed to get agents', { err: getLogStructForError(err) });
      throw new NotFoundException();
    }
  }

  @Get('/agencies/:salesforceId/contacts')
  @Roles(UserRole.Internal)
  async searchContacts(
    @Param('salesforceId', SalesforceObjectIdValidator) salesforceId: string
  ): Promise<GetSalesforceAgentsResponse> {
    try {
      const res = await this.salesforceService.getContactsForAgency(salesforceId);

      return {
        status: 'ok',
        data: mapSalesforceRecordsForResponse(res),
      };
    } catch (err) {
      Logger.error('Failed to get contacts', { err: getLogStructForError(err) });
      throw new NotFoundException();
    }
  }

  @Get('/metadata')
  async getMetadata(): Promise<GetSalesforceMetadataResponse> {
    // Currently only used for biz dev decline reasons, but can add more metadata here if needed
    const metadata = {
      bizDevDeclineReasons: this.salesforceService.getDeclineReasonBizDevOptions(),
    };

    return {
      status: 'ok',
      data: metadata,
    };
  }

  // Get case info by id
  @Get('/case/:salesforceId')
  @Roles(UserRole.Internal)
  async getSubmissionInfoFromCase(
    @Param('salesforceId', SalesforceObjectIdValidator) salesforceId: string
  ): Promise<GetSubmissionDetailsFromCaseResponse> {
    try {
      const user = getCurrentUser();
      const res = await this.salesforceService.getSubmissionDetailsFromCaseId(salesforceId, user);

      return {
        status: 'ok',
        data: res,
      };
    } catch (err) {
      Logger.error('Failed to get submission details from case', { err: getLogStructForError(err) });
      throw new NotFoundException();
    }
  }

  // Check for duplicate "submissions" / opportunities
  @Post('/opportunities/duplicateCheck')
  @Roles(UserRole.Internal)
  async getDuplicateOpportunities(
    @Body(new JoiValidationPipe(CheckForDuplicateOpportunitiesSchema))
    data: CheckForDuplicateSalesforceOpportunitiesRequest
  ): Promise<CheckForDuplicateSalesforceOpportunitiesResponse> {
    Logger.log('getDuplicateOpportunities', { data });

    try {
      // Find duplicate opportunities
      const res = await this.salesforceService.getDuplicateOpportunities(data.salesforceAccountId);

      // Get salesforce base url from SalesforceClient.connection.instanceUrl
      const salesforceInstanceUrl = this.salesforceService.getSalesforceInstanceUrl();

      return {
        status: 'ok',
        data: res ? mapSalesforceOpporunityRecordsForResponse(res, salesforceInstanceUrl) : [],
      };
    } catch (err) {
      Logger.error('Failed to check for duplicate opportunities', { err: getLogStructForError(err) });
      throw new InternalServerErrorException();
    }
  }
}

function mapSalesforceRecordsForResponse(records: SalesforceBaseRecord[]): SalesforceBaseRecordResponse[] {
  return records.map(({ Id, Name }) => ({
    id: Id,
    name: Name,
  }));
}

function mapSalesforceOpporunityRecordsForResponse(
  records: SalesforceOppWithAgency[],
  salesforceInstanceUrl: string
): SalesforceOpportunityRecordResponse[] {
  return records.map(
    ({ Id, Name, AccountId, StageName, Type, IsClosed, Target_Effective_Date__c, State__c, Appointed_Agency__r }) => ({
      id: Id,
      accountId: AccountId,
      appointedAgency__r: Appointed_Agency__r,
      name: Name,
      isClosed: IsClosed,
      stageName: StageName,
      state: State__c.split(';'),
      targetEffectiveDate: Target_Effective_Date__c,
      type: Type,
      viewLink: `${salesforceInstanceUrl}/lightning/r/Opportunity/${Id}/view`,
    })
  );
}

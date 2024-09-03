import { Module } from '@nestjs/common';

import { SalesforceController } from './salesforce.controller';
import { SalesforceService } from './salesforce.service';
import CommonModule from '../common/common.module';
import salesforceClientProvider from './salesforceClient.provider';

@Module({
  imports: [CommonModule],
  controllers: [SalesforceController],
  providers: [SalesforceService, salesforceClientProvider],
  exports: [SalesforceService],
})
export class SalesforceModule {}

export default SalesforceModule;

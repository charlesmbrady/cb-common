import { Global, Module } from '@nestjs/common';

import { SimpleDynamoDbService } from '@curi-com-services/lambda';

import CognitoResourceServerClientService from './cognitoResourceServerClient.service';
import DatabaseService from './database.service';
import DocumentService from './document.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CognitoResourceServerClientService, DocumentService, DatabaseService, SimpleDynamoDbService],
  exports: [CognitoResourceServerClientService, DocumentService, DatabaseService],
})
export class CommonModule {}

export default CommonModule;

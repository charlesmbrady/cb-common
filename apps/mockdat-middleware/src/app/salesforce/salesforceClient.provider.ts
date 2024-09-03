import { ConfigService } from '@nestjs/config';

import { SalesforceClient } from '@cb-common/salesforce';
import { getSecret } from '@cb-common/lambda';

const salesforceClientProvider = {
  provide: 'SALESFORCE_CLIENT',
  useFactory: async (configService: ConfigService) => {
    const certKey = await getSecret(configService.get<string>('MOCKDAT_MIDDLEWARE_SALESFORCE_CERT_KEY_SECRET_ARN'));

    if (!certKey) {
      throw new Error('Failed to retrieve Salesforce secrets');
    }

    return new SalesforceClient({
      auth: {
        certKey,
        subject: configService.get<string>('SALESFORCE_LOGIN_SUBJECT'),
        domain: configService.get<string>('SALESFORCE_LOGIN_DOMAIN'),
        clientId: configService.get<string>('SALESFORCE_CLIENT_ID'),
      },
    });
  },
  inject: [ConfigService],
};

export default salesforceClientProvider;

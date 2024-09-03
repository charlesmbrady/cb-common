import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as Joi from 'joi';

import { EventLoggerMiddleware, LocalAuthMiddleware, RolesGuard } from '@cb-common/lambda';

import CommonModule from './common/common.module';
import SalesforceModule from './salesforce/salesforce.module';

const requiredEnvVar = Joi.string().trim().min(1).required();

@Module({
  imports: [
    CommonModule,
    SalesforceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        AWS_REGION: requiredEnvVar,
        MOCKDAT_MIDDLEWARE_SALESFORCE_CERT_KEY_SECRET_ARN: requiredEnvVar,
        SALESFORCE_LOGIN_SUBJECT: requiredEnvVar,
        SALESFORCE_LOGIN_DOMAIN: requiredEnvVar,
        SALESFORCE_CLIENT_ID: requiredEnvVar,

        SIGNED_URL_EXPIRES_IN: Joi.number().min(1).required(),

        EMAIL_NOTIFICATIONS_FROM_ADDRESS: requiredEnvVar,
        DYNAMO_DB_SUBMISSION_TABLE_NAME: requiredEnvVar,
        APP_BASE_URL: requiredEnvVar,

        // for local authentication
        USE_LOCAL_AUTH: Joi.boolean().default(false),
        COGNITO_USER_POOL_ID: Joi.string().trim().min(1).when('USE_LOCAL_AUTH', {
          is: true,
          then: requiredEnvVar,
        }),
        COGNITO_CLIENT_ID: Joi.string().trim().min(1).when('USE_LOCAL_AUTH', {
          is: true,
          then: requiredEnvVar,
        }),
      }).options({ abortEarly: false }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (this.configService.get('USE_LOCAL_AUTH')) {
      consumer.apply(LocalAuthMiddleware).forRoutes('*');
    }

    consumer.apply(EventLoggerMiddleware).forRoutes('*');
  }
}

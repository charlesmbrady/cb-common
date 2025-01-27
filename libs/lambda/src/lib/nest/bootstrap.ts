import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import { AppModule } from './app.module';

import { getLogger } from '../logger';

let cachedServer: APIGatewayProxyHandler;

const binaryMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export async function bootstrap(AppModule) {
  if (!cachedServer) {
    const expressApp = express();

    const nestApp = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        rawBody: true,
      }
    );
    const logger = getLogger();
    nestApp.useLogger(logger);
    nestApp.enableCors();

    await nestApp.init();
    console.log('NestJS app bootstrapper');
    cachedServer = serverlessExpress.configure({
      app: expressApp,
      log: logger,
      binaryMimeTypes,
    });
  }

  return cachedServer;
}

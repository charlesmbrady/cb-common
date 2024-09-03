import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as serverlessExpress from '@vendia/serverless-express';
import * as express from 'express';

import { getLogger } from '../logger';

let cachedServer: APIGatewayProxyHandler;

const binaryMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

export async function bootstrap(AppModule: unknown) {
  if (!cachedServer) {
    const expressApp = express();

    const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp), {
      rawBody: true,
    });
    const logger = getLogger();
    nestApp.useLogger(logger);
    nestApp.enableCors();

    await nestApp.init();
    cachedServer = serverlessExpress.configure({ app: expressApp, log: logger, binaryMimeTypes });
  }

  return cachedServer;
}

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   Logger.log(
//     `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
//   );
// }

// bootstrap();

// src/lambda.ts

import { Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // Use default import
import serverlessExpress from '@vendia/serverless-express'; // Default import

let server: Handler;

const bootstrapServer = async (): Promise<void> => {
  if (!server) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );
    await app.init();
    server = serverlessExpress({ app: expressApp }); // Initialize serverlessExpress with the app
  }
};

export const handler: Handler = async (event, context, callback) => {
  await bootstrapServer();
  return server(event, context, callback); // Invoke the serverlessExpress handler
};

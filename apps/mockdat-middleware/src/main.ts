import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import { bootstrap, getLogger } from '@cb-common/lambda';

import { AppModule } from './app/app.module';

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  const server = await bootstrap(AppModule);
  return server(event, context, () => void 0);
};

const logger = getLogger();

/**
 * This only runs locally
 */
async function bootstrapLocal() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  app.useLogger(logger);
  app.enableCors();

  const port = process.env.PORT || 3333;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

if (process.env.BOOTSTRAP_LOCALLY === 'true') {
  logger.log('Bootstrapping locally');
  bootstrapLocal();
}

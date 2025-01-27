import 'reflect-metadata'; // Must be the first import
import { Handler, Context } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { bootstrap, getLogger } from '@cb-common/lambda';
// import { AppModule, getLogger, bootstrap } from '@cb-common/lambda';
import { AppModule } from './app/app.module';

export const handler: Handler = async (event: any, context: Context) => {
  console.log('Lambda invoked with event:', JSON.stringify(event, null, 2));

  const server = await bootstrap(AppModule);
  return server(event, context, () => void 0);
};

const logger = getLogger();
logger.info('Lambda handler loaded');

async function bootstrapLocal() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(logger);
  app.enableCors();

  await app.listen(3333);
  logger.info('Local server started');
}

if (process.env.BOOTSTRAP_LOCAL === 'true') {
  logger.info('Bootstrapping local server');
  bootstrapLocal();
}

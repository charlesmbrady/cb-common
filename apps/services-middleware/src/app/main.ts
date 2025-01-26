import { NestFactory } from '@nestjs/core';
import { AppModule } from '@cb-common/lambda';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

if (process.env.BOOTSTRAP_LOCALLY === 'true') {
  bootstrap();
}

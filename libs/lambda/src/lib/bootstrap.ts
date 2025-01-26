import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

/**
 * Bootstraps a Nest.js application.
 * @param module The root module of the application.
 * @returns A promise that resolves to the application instance.
 */
export async function bootstrap(module: any): Promise<INestApplication> {
  const expressApp = express();
  const app = await NestFactory.create(module, new ExpressAdapter(expressApp));
  await app.init();
  return app;
}

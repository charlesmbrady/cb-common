import { Handler } from 'aws-lambda';
import { bootstrap } from './bootstrap';
import { createServer } from './create-server';
import { AppModule } from './app.module'; // Make sure this file exists

let server: Handler;

export const handler: Handler = async (event, context, callback) => {
  if (!server) {
    const app = await bootstrap(AppModule);
    server = createServer(app);
  }
  return server(event, context, callback);
};

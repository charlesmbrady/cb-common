import { bootstrap } from '@cb-common/lambda';
import { createServer } from '@cb-common/lambda';
import { AppModule } from '@cb-common/lambda';

import { Handler } from 'aws-lambda';

let server: Handler;

export const handler: Handler = async (event, context, callback) => {
  if (!server) {
    const app = await bootstrap(AppModule);
    server = createServer(app);
  }
  return server(event, context, callback);
};

// Optional: Local bootstrap for development
if (process.env.BOOTSTRAP_LOCALLY === 'true') {
  import('@nestjs/core').then(({ NestFactory }) => {
    NestFactory.create(AppModule)
      .then((app) => {
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        const port = process.env.PORT || 3333;
        return app.listen(port);
      })
      .then(() => {
        console.log(
          `🚀 Application is running on: http://localhost:${
            process.env.PORT || 3333
          }/api`
        );
      })
      .catch((err) => {
        console.error('Error bootstrapping locally:', err);
        process.exit(1);
      });
  });
}

import serverlessExpress from '@vendia/serverless-express';

export function createServer(app: any) {
  return serverlessExpress({ app });
}

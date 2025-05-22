import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export type LambdaEvent = APIGatewayProxyEvent;

export type HandlerStore = {
  context: Context;
  event: LambdaEvent;
};

export type APIGatewayProxyHandlerStore = HandlerStore & {
  event: APIGatewayProxyEvent;
};

import {
  APIGatewayProxyEvent,
  Context,
  CloudWatchLogsEvent,
  EventBridgeEvent,
  S3Event,
  SNSEvent,
  CustomMessageTriggerEvent,
  PostAuthenticationTriggerEvent,
  PostConfirmationTriggerEvent,
  PreAuthenticationTriggerEvent,
  PreTokenGenerationTriggerEvent,
  PreSignUpTriggerEvent,
  UserMigrationTriggerEvent,
} from 'aws-lambda';

// add any new events we support here
export type LambdaEvent =
  | APIGatewayProxyEvent
  | CustomMessageTriggerEvent
  | PostAuthenticationTriggerEvent
  | PostConfirmationTriggerEvent
  | PreAuthenticationTriggerEvent
  | PreTokenGenerationTriggerEvent
  | PreSignUpTriggerEvent
  | UserMigrationTriggerEvent
  | CloudWatchLogsEvent
  | EventBridgeEvent<string, unknown>
  | S3Event
  | SNSEvent;

export type HandlerStore = {
  context: Context;
  event: LambdaEvent;
};

// not currently using this, but keeping example of how to add more
export type CloudWatchLogsHandlerStore = HandlerStore & {
  event: CloudWatchLogsEvent;
};

export type APIGatewayProxyHandlerStore = HandlerStore & {
  event: APIGatewayProxyEvent;
};

export type CustomMessageHandlerStore = HandlerStore & {
  event: CustomMessageTriggerEvent;
};

export type PostAuthenticationHandlerStore = HandlerStore & {
  event: PostAuthenticationTriggerEvent;
};

export type PostConfirmationHandlerStore = HandlerStore & {
  event: PostConfirmationTriggerEvent;
};

export type PreAuthenticationHandlerStore = HandlerStore & {
  event: PreAuthenticationTriggerEvent;
};

export type PreTokenGenerationHandlerStore = HandlerStore & {
  event: PreTokenGenerationTriggerEvent;
};

export type PreSignUpHandlerStore = HandlerStore & {
  event: PreSignUpTriggerEvent;
};

export type UserMigrationHandlerStore = HandlerStore & {
  event: UserMigrationTriggerEvent;
};

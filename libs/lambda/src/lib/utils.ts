import { getCurrentInvoke as codegenieGetCurrentInvoke } from '@codegenie/serverless-express';
import mockEvent from './mock/event.json';
import mockContext from './mock/context.json';
import { Context, APIGatewayProxyEvent } from 'aws-lambda';

export function getCurrentInvoke() {
  // If running in AWS Lambda, codegenieGetCurrentInvoke will return the real context
  const invoke = codegenieGetCurrentInvoke();
  if (invoke && invoke.event && invoke.context) {
    return invoke;
  }
  // Otherwise, return mock event/context for local dev
  return {
    event: mockEvent as unknown as APIGatewayProxyEvent,
    context: mockContext as unknown as Context,
  };
}

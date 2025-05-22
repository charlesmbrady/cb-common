import { getCurrentInvoke as codegenieGetCurrentInvoke } from '@codegenie/serverless-express';
import mockEvent from './mock/event.json';
import mockContext from './mock/context.json';

export function getCurrentInvoke() {
  // If running in AWS Lambda, codegenieGetCurrentInvoke will return the real context
  const invoke = codegenieGetCurrentInvoke();
  if (invoke && invoke.event && invoke.context) {
    return invoke;
  }
  // Otherwise, return mock event/context for local dev
  return {
    event: mockEvent,
    context: mockContext,
  };
}

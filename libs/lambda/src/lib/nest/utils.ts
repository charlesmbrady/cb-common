import { getCurrentInvoke as realGetCurrentInvoke } from '@vendia/serverless-express';

import { AuthorizedCognitoUser, AuthorizerClaims } from '@cb-common/data';

import * as mockEvent from './mock/event.json';
import * as mockContext from './mock/context.json';

export function getCurrentInvoke() {
  const { event, context } = realGetCurrentInvoke();
  // quick way to check whether we're in lambda or local
  if (!context) {
    return { event: mockEvent, context: mockContext };
  }

  return { event, context };
}

export function getCurrentClaims(): AuthorizerClaims {
  const { event } = getCurrentInvoke();
  return event.requestContext.authorizer.claims;
}

export function overrideMockClaims(claims: AuthorizerClaims) {
  const { context } = realGetCurrentInvoke();
  // don't allow if we're in a lambda
  if (context) {
    return;
  }

  mockEvent.requestContext.authorizer.claims = claims;
}

export function getCurrentUser(): AuthorizedCognitoUser {
  const claims = getCurrentClaims();
  return new AuthorizedCognitoUser(claims);
}

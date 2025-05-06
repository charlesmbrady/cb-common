import { CognitoAuthConfig } from '@cb-common/auth';

export const cognitoConfig: CognitoAuthConfig = {
  authority:
    process.env.NEXT_PUBLIC_COGNITO_DOMAIN ||
    'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_YIYfB6zj2',
  client_id:
    process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '95bnaovlmigsl42a1qej7gb2o',
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  response_type: 'code',
  scope: 'email openid profile',
  logout_uri: process.env.NEXT_PUBLIC_LOGOUT_URI || 'http://localhost:3000',
};

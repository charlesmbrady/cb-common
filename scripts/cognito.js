const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
require('dotenv').config();

const REGION = process.env.AWS_REGION || 'us-east-1';
const USER_POOL_ID = 'us-east-1_1_YIYfB6zj2';

const client = new CognitoIdentityProviderClient({ region: REGION });

async function listUsers() {
  try {
    const command = new ListUsersCommand({ UserPoolId: USER_POOL_ID });
    const response = await client.send(command);
    console.log('Cognito Users:', response.Users);
  } catch (error) {
    console.error('Error listing Cognito users:', error);
    process.exit(1);
  }
}

listUsers();

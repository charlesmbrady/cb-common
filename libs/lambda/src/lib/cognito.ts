import { CognitoIdentityProviderClient, ListUsersCommand, UserType } from '@aws-sdk/client-cognito-identity-provider';

import { CognitoUser, ListUsersParameters, ListUsersResponse } from '@cb-common/data';

import { getLogger } from './logger';

const cognitoClient = new CognitoIdentityProviderClient({
  region: 'us-east-1',
});

const logger = getLogger();

export async function listUsers(userPoolId: string, parameters: ListUsersParameters): Promise<ListUsersResponse> {
  logger.info('Listing users', { parameters });

  const { filter, limit, paginationToken } = parameters;
  const listUsersResponse = await cognitoClient.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: filter,
      Limit: limit,
      PaginationToken: paginationToken,
    })
  );

  return {
    users: mapUsers(listUsersResponse.Users),
    paginationToken: listUsersResponse.PaginationToken,
  };
}

function mapUsers(users?: UserType[]): CognitoUser[] {
  if (!users) {
    return [];
  }

  return users.map((user) => ({
    attributes: user.Attributes?.map((attribute) => ({
      name: attribute.Name ?? '', // shouldn't happen, but it's in the type
      value: attribute.Value,
    })),
    enabled: user.Enabled,
    userCreateDate: user.UserCreateDate?.toISOString(),
    userLastModifiedDate: user.UserLastModifiedDate?.toISOString(),
    username: user.Username,
    userStatus: user.UserStatus,
  }));
}

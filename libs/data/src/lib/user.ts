import { AuthorizerClaims, CognitoUser, UserRole } from './types';

const BROKER_ROLES = [UserRole.AgencyAdmin, UserRole.AgencyProducer] as const;

export function hasBrokerRole(roles: UserRole[]) {
  return BROKER_ROLES.some((brokerRole) => roles.includes(brokerRole));
}

export function hasInternalRole(roles: UserRole[]) {
  return roles.some((role) => role === UserRole.Internal);
}

// helper
export function isInternalUser(claims: AuthorizerClaims) {
  return hasInternalRole(claims.roles.split(',') as UserRole[]);
}

export function isRootInternalEmailAddress(email: string): boolean {
  // @curi.com emails (exclude emails with + extensions in them so they can be used for testing with other roles)
  return /@curi\.com$/i.test(email) && !email.includes('+');
}

export function getSsoUserId(user?: CognitoUser | null): string | null {
  return (
    user?.attributes?.find((attr) => attr.name === 'custom:ssoUserId')?.value ??
    null
  );
}

export class AuthorizedCognitoUser {
  public readonly id: string;
  public readonly isInternal: boolean;
  public readonly isAdmin: boolean;
  public readonly roles: UserRole[];
  public readonly policies: string[];
  public readonly email: string;
  public readonly firstName: string;
  public readonly lastName: string;

  constructor(public readonly claims: AuthorizerClaims) {
    // this is almost always the user ID we want to use
    this.id = claims['custom:ssoUserId'];
    this.isInternal = isInternalUser(claims);
    this.roles = claims.roles.split(',') as UserRole[];
    this.policies = claims.policies.split(',');
    this.email = claims.email;
    this.firstName = claims.firstName;
    this.lastName = claims.lastName;
    this.isAdmin = this.roles.includes(UserRole.SiteAdmin);
  }

  hasRole(role: UserRole) {
    return this.roles.includes(role);
  }
}

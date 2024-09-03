import { AuthorizerClaims, UserRole } from '@cb-common/data';

export function getRoles(claims: AuthorizerClaims): UserRole[] {
  return claims.roles.split(',') as UserRole[];
}

export function checkRole(userRoles: readonly UserRole[], allowedRoles: readonly UserRole[]) {
  return userRoles.some((userRole) => allowedRoles.includes(userRole));
}

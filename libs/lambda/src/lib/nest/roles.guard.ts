import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '@cb-common/data';

import { ROLES_KEY } from './roles.decorator';
import { getCurrentClaims } from './utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const claims = getCurrentClaims();
    // should never happen with API Gateway in front
    if (!claims?.roles) {
      return false;
    }

    const userRoles = claims.roles.split(',');
    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}

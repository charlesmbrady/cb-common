import { ForbiddenException, HttpException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import { ConfigService } from '@nestjs/config';

import { AuthorizerClaims } from '@cb-common/data';

import { overrideMockClaims } from './utils';

type IdTokenVerifier = {
  tokenUse: 'id';
  userPoolId: string;
  clientId: string;
};

@Injectable()
export class LocalAuthMiddleware implements NestMiddleware {
  private idTokenVerifier: CognitoJwtVerifierSingleUserPool<IdTokenVerifier> | null = null;

  constructor(readonly configService: ConfigService) {
    const userPoolId = configService.get('COGNITO_USER_POOL_ID');
    const clientId = configService.get('COGNITO_CLIENT_ID').split(',');

    if (!userPoolId || !clientId) {
      Logger.warn('COGNITO_USER_POOL_ID or COGNITO_CLIENT_ID not set, skipping local auth middleware');
      return;
    }

    this.idTokenVerifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'id',
      clientId,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!this.idTokenVerifier) {
      return next(new HttpException('Local auth middleware not configured', 500));
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new ForbiddenException('No token provided'));
    }

    try {
      const claims = (await this.idTokenVerifier.verify(token)) as unknown as AuthorizerClaims;
      Logger.log('Overriding claims with token');
      overrideMockClaims(claims);
    } catch (err) {
      Logger.error('Failed to verify token', err);
      return next(new ForbiddenException((err as Error).message || 'Failed to verify token'));
    }

    next();
  }
}

export default LocalAuthMiddleware;

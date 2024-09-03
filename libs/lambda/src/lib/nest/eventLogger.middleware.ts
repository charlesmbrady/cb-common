import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { getCurrentInvoke } from './utils';
import { redact } from '../logger';

@Injectable()
export class EventLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { event, context } = getCurrentInvoke();
    Logger.log('EventLogger', { event: redact(event), context });
    next();
  }
}

export default EventLoggerMiddleware;

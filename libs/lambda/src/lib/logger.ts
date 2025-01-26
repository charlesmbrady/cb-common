/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@nestjs/common';
import { LambdaLog } from 'lambda-log';

// this logger is shared by non-nestjs lambdas, do not add nest-specific implementations
export class Logger implements LoggerService {
  private logger = new LambdaLog();

  log(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, { params: optionalParams });
  }

  info(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, { params: optionalParams });
  }

  error(message: any, ...optionalParams: any[]) {
    return this.logger.error(message, { params: optionalParams });
  }

  warn(message: any, ...optionalParams: any[]) {
    return this.logger.warn(message, { params: optionalParams });
  }

  debug(message: any, ...optionalParams: any[]) {
    return this.logger.debug(message, { params: optionalParams });
  }

  verbose(message: any, ...optionalParams: any[]) {
    return this.logger.debug(message, { params: optionalParams });
  }
}

export const getLogger = () => new Logger();

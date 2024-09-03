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

const logger = new Logger();
export function getLogger() {
  return logger;
}

const REDACT_KEYS = ['password', 'temporaryPassword', 'Authorization', 'client_secret'];
function redacter(key: string, value: unknown) {
  if (REDACT_KEYS.includes(key)) {
    return '[REDACTED]';
  }
  return value;
}

export function redact(data: unknown) {
  try {
    return JSON.parse(JSON.stringify(data, redacter));
  } catch {
    // probably a circular reference error
    return data;
  }
}

export function getLogStructForError(err: unknown) {
  if (!err || typeof err !== 'object') {
    return {
      name: 'unknown',
      message: 'unknown',
      stack: 'unknown',
      sourceError: err,
    };
  }

  // generally safe assumption
  const error = err as Error;
  const baseError = {
    name: error.name || 'unknown',
    message: error.message || 'unknown',
    stack: error.stack || 'unknown',
  };

  try {
    return {
      ...baseError,
      sourceError: redact(err),
    };
  } catch (redactErr) {
    // probably a circular reference error
    return {
      ...baseError,
      sourceError: err,
      redactErr,
    };
  }
}

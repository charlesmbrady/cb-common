import LambdaLog from 'lambda-log';

export class Logger {
  private lambdaLog = LambdaLog;

  log(message: string, meta?: Record<string, any>) {
    this.lambdaLog.log(message, meta);
  }

  info(message: string, meta?: Record<string, any>) {
    this.lambdaLog.info(message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.lambdaLog.warn(message, meta);
  }

  error(message: string, error?: Error, meta?: Record<string, any>) {
    this.lambdaLog.error(message, {
      error: error ? this.formatError(error) : undefined,
      ...meta,
    });
  }

  debug(message: string, meta?: Record<string, any>) {
    this.lambdaLog.debug(message, meta);
  }

  verbose(message: string, meta?: Record<string, any>) {
    this.lambdaLog.verbose(message, meta);
  }

  request(requestId: string, meta?: Record<string, any>) {
    this.lambdaLog.info('Request received', { requestId, ...meta });
  }

  private formatError(error: Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
}

export const logger = new Logger();

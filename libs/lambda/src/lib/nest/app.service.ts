import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    Logger.log('Hello World service!');
    return 'Hello World service!';
  }
}

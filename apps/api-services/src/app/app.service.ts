import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {
    console.log('AppService instantiated');
  }

  getHello(): string {
    Logger.log('Hello World service!');
    return 'Hello World service!';
  }
}

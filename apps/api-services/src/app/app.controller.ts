import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    if (!appService) {
      console.log('AppService is undefined in AppController');
      this.appService = new AppService(); //FIXME: Dependency injection not working properly so had to add this for now but not ideal.
    } else {
      console.log('AppService successfully injected:', appService);
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck(): Promise<string> {
    // add logs
    console.log('Health check');
    const data = this.appService.getHello();

    return data;
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ReturnResponseType } from './helper/returnResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ReturnResponseType<string> {
    return this.appService.getHello();
  }

  @Post('updateNamespaces')
  testWs(@Body() payload: { message: string }) {
    return this.appService.sendMessageToClients(payload);
  }
}

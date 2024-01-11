import { Injectable } from '@nestjs/common';
import ReturnResponse, { ReturnResponseType } from './helper/returnResponse';

@Injectable()
export class AppService 
{
  getHello(): ReturnResponseType<string>
  {
    return ReturnResponse('Hello World!');
  }

  testWs()
  {
  }
}

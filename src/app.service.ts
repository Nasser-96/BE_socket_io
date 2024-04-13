import { Injectable } from '@nestjs/common';
import ReturnResponse, { ReturnResponseType } from './helper/returnResponse';
import { Server } from 'socket.io';
import { SocketService } from './socket/socket.service';

@Injectable()
export class AppService {
  constructor(private readonly socketService: SocketService) {}

  getHello(): ReturnResponseType<string> {
    return ReturnResponse('Hello World!');
  }

  async sendMessageToClients(payload: { message: string }) {
    console.log(payload);

    await this.socketService.emitToServer('messageFromClient', payload);
  }
}

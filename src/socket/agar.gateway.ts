import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from '../app.service';
import ReturnResponse, { ReturnResponseType } from '../helper/returnResponse';
import { SocketWithAuth } from 'src/types&enums/types';
import { MyNameSpaces } from './socket.namespaces';

@WebSocketGateway({ cors: true, namespace: 'agar' })
export class AgarGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AgarGateway.name);
  private myNamespaces: MyNameSpaces;
  constructor() {}

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.logger.debug(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    this.logger.debug(`Client connected: ${client.username} to agar`);
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.logger.log(`Disconnected socket id: ${client.username} from agar`);
  }

  @SubscribeMessage('emitToAgar')
  async handleMessage(client: SocketWithAuth, payload) {
    console.log(`${client.username}: ${payload}`);
  }

  @SubscribeMessage('')
  handleUpdateNamespace(client: Socket, namespace: string) {}
}

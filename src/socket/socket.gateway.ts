import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from '../app.service';
import ReturnResponse, { ReturnResponseType } from '../helper/returnResponse';
import { NamespaceClass } from '../classes/Namespace';
import { Room } from '../classes/Room';
import { SocketWithAuth } from 'src/types&enums/types';
import { MyNameSpaces } from './socket.namespaces';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppGateway.name);
  private myNamespaces: MyNameSpaces;
  constructor(private readonly appService: AppService) {
    this.myNamespaces = new MyNameSpaces();
  }

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.myNamespaces.getMyNameSpaces().forEach((namespace) => {
      this.server
        .of(namespace.endpoint)
        .on('connection', (socket: SocketWithAuth) => {
          socket.on(
            'joinRoom',
            async (
              roomTitle: string,
              res: (value: ReturnResponseType<any>) => void,
            ) => {
              socket.join(roomTitle);
              const sockets = await this.server
                .of(namespace.endpoint)
                .in(roomTitle)
                .fetchSockets();
              const socketCount = sockets.length;

              res(
                ReturnResponse({
                  namespaces: this.myNamespaces.getMyNameSpaces(),
                  count: socketCount,
                }),
              );
              this.logger.debug(
                `Client ${socket.username} joined room: ${roomTitle}`,
              );
            },
          );
          this.logger.debug(
            `Client ${socket.username} joined namespace: ${namespace.endpoint}`,
          );
        });
    });
    this.logger.debug(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    this.logger.debug(`Client connected: ${client.username}`);

    setTimeout(() => {
      this.server.emit(
        'nsList',
        ReturnResponse(this.myNamespaces.getMyNameSpaces()),
      );
      this.server.emit('messageFromServer', { data: 'Welcome to SocketIo' });
    }, 100);
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.myNamespaces.getMyNameSpaces().forEach((namespace) => {
      this.server
        .of(namespace.endpoint)
        .off('connection', (socket: SocketWithAuth) => {
          socket.off(
            'joinRoom',
            (
              roomTitle: string,
              res: (value: ReturnResponseType<any>) => void,
            ) => {
              socket.join(roomTitle);
              res(ReturnResponse(this.myNamespaces.getMyNameSpaces()));
              this.logger.debug(
                `Client ${socket.username} joined room: ${roomTitle}`,
              );
            },
          );
          this.logger.debug(
            `Client ${socket.username} joined namespace: ${namespace.endpoint}`,
          );
        });
    });
    this.logger.log(`Disconnected socket id: ${client.username}`);
  }

  @SubscribeMessage('messageFromClient')
  async handleMessage(
    client: SocketWithAuth,
    payload: {
      namespace: string;
      room: string;
      message: string;
      is_server: boolean;
    },
  ) {
    const sockets = await this.server
      .of(payload.namespace)
      .in(payload.room)
      .fetchSockets();
    let isInThisRoomAndNamespace = false;

    sockets.forEach((user: any) => {
      if (client.user_id === user.user_id) {
        isInThisRoomAndNamespace = true;
      }
    });

    if (!payload.is_server) {
      this.myNamespaces.getMyNameSpaces().forEach((namespace) => {
        if (namespace.endpoint === payload.namespace) {
          namespace.rooms.forEach((room) => {
            if (room.roomTitle === payload.room) {
              room.addMessage(payload.message);
            }
          });
        }
      });
    }
    if (isInThisRoomAndNamespace) {
      this.server
        .of(payload.namespace)
        .to(payload.room)
        .emit(
          'messageToClient',
          ReturnResponse({
            message: payload.message,
            nsList: this.myNamespaces.getMyNameSpaces(),
          }),
        );
      return ReturnResponse({}, '', 'Message Sent Successfully');
    }
  }

  @SubscribeMessage('updateNamespaces')
  handleUpdateNamespace(client: Socket, namespace: string) {
    return this.myNamespaces.getMyNameSpaces();
  }
}

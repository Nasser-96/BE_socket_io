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
import ReturnResponse from '../helper/returnResponse';
import { NamespaceClass } from '../classes/Namespace';
import { Room } from '../classes/Room';
import { SocketWithAuth } from 'src/types&enums/types';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppGateway.name);
  constructor(private readonly appService: AppService) {}

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.logger.debug(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    this.logger.debug(`Client connected: ${client.username}`);
    const wikiNs = new NamespaceClass(
      0,
      'Wikipedia',
      'https://i.insider.com/5fbd515550e71a001155724f?width=700',
      '/wiki',
    );
    const mozNs = new NamespaceClass(
      1,
      'Mozilla',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/1200px-Firefox_logo%2C_2019.svg.png',
      '/mozilla',
    );
    const linuxNs = new NamespaceClass(
      2,
      'Linux',
      'https://cdn.pixabay.com/photo/2013/07/13/11/43/tux-158547_640.png',
      '/linux',
    );
    wikiNs.addRoom(new Room(0, 'New Articles', 0));
    wikiNs.addRoom(new Room(1, 'Editors', 0));
    wikiNs.addRoom(new Room(2, 'Other', 0));

    mozNs.addRoom(new Room(0, 'Firefox', 1));
    mozNs.addRoom(new Room(1, 'SeaMonkey', 1));
    mozNs.addRoom(new Room(2, 'SpiderMonkey', 1));
    mozNs.addRoom(new Room(3, 'Rust', 1));

    linuxNs.addRoom(new Room(0, 'Debian', 2));
    linuxNs.addRoom(new Room(1, 'Red Hat', 2));
    linuxNs.addRoom(new Room(2, 'Ubunto', 2));
    linuxNs.addRoom(new Room(3, 'Mac OS', 2));

    const namespaces = [wikiNs, mozNs, linuxNs];

    setTimeout(() => {
      this.server.emit('nsList', ReturnResponse(namespaces));
      this.server.emit('messageFromServer', { data: 'Welcome to SocketIo' });
    }, 100);

    client.join('chat');
    this.server
      .to('chat')
      .emit(
        'isConnectedToChatRoom',
        ReturnResponse({ message: 'Welcome To chat room' }),
      );
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.logger.log(`Disconnected socket id: ${client.username}`);
  }

  @SubscribeMessage('messageFromClient')
  handleMessage(client: SocketWithAuth, payload: { message: string }) {
    this.server.emit('messageToClient', ReturnResponse({ message: payload }));
  }

  @SubscribeMessage('subscribeToNamespace')
  handleSubscribeToNamespace(client: Socket, namespace: string) {
    // if (!this.server.adapter().prototype.rooms.has(namespace)) {
    //   this.logger.debug(`Creating new namespace: ${namespace}`);
    // }

    client.join(namespace);
    // this.logger.debug(`Client ${client.id} subscribed to namespace: ${namespace}`);
  }
}

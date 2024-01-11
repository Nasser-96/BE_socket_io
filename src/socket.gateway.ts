import {
    Logger,
  } from '@nestjs/common';
  import {
    OnGatewayInit,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { Namespace, Socket } from 'socket.io';
import { AppService } from './app.service';
  
  @WebSocketGateway({cors:true})
  export class AppGateway
  {
    private readonly logger = new Logger(AppGateway.name);
    constructor(private readonly appService: AppService) {}
  
    @WebSocketServer() io: Namespace;

    afterInit(): void 
    {
      this.logger.log(`Websocket Gateway initialized.`);
    }
  
    async handleConnection(client: Socket) 
    {
      this.logger.debug(`Socket connected with userID: ${client.id}`);
      this.io.emit('Welcome To SocketIo', client.id)
      setTimeout(()=>
      {
        this.io.emit('messageFromServer', {data:"Welcome to SocketIo"})
      },100)
    }
  
    async handleDisconnect(client: Socket) 
    {
      this.logger.log(`Disconnected socket id: ${client.id}`);
    }

    @SubscribeMessage("message")
    handleMessage(@MessageBody() message:string)
    {
        this.logger.log(message);
    }
  }
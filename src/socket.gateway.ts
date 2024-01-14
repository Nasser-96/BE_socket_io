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
import ReturnResponse from './helper/returnResponse';
  
  @WebSocketGateway({cors:true,namespace:"namespace"})
  export class AppGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect
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
        this.io.emit('messageToClient', ReturnResponse(message));
    }
  }
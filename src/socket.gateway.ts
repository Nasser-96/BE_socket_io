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
      const wikiNs=
      {
        ns:'/wiki',
        image:'https://i.insider.com/5fbd515550e71a001155724f?width=700'
      }
      const mozNs=
      {
        ns:'/mozilla',
        image:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/1200px-Firefox_logo%2C_2019.svg.png'
      }
      const linuxNs=
      {
        ns:'/linux',
        image:'https://cdn.pixabay.com/photo/2013/07/13/11/43/tux-158547_640.png'
      }

      const namespaces = [wikiNs,mozNs,linuxNs]

      this.logger.debug(`Socket connected with userID: ${client.id}`);
      setTimeout(()=>
      {
        this.io.emit("nsList",ReturnResponse(namespaces))
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
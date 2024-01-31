import { INestApplicationContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server } from "socket.io";
import { SocketWithAuth } from "src/types&enums/types";

export class SocketIoAdapter extends IoAdapter
{
    private readonly logger = new Logger(SocketIoAdapter.name)
    constructor(
        private app:INestApplicationContext,
        private configService:ConfigService
        ){super(app)}
    createIOServer(port: number, options?: any) 
    {   
        const jwtService = this.app.get(JwtService)

        const server:Server = super.createIOServer(port,options)
        server.of('namespace').use(createTokenMiddleware(jwtService,this.logger))
        return server
    }
}

const createTokenMiddleware = (jwtService:JwtService,logger:Logger) =>
async (socket:SocketWithAuth,next ) =>
{
    const token = socket.handshake.auth.token || socket.handshake.headers['token']
    
    try
    {
        const payload = await jwtService.verifyAsync(
            token,
            {
              secret: process.env.JSON_TOKEN_KEY
            }
          );
        socket.username = payload.username
        socket.id = payload.id
        next()
    }
    catch(error)
    {
        next(new Error('DataBase Error'))
    }
}
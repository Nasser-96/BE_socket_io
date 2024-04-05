import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from 'src/types&enums/types';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const optionsWithCORS: ServerOptions = {
      ...options,
    };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCORS);
    server.of('/chat').use(createTokenMiddleware(jwtService, this.logger));
    server.of('/').use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    try {
      const payload = jwtService.verify(token, {
        secret: process.env.JSON_TOKEN_KEY,
      });
      socket.user_id = payload.id;
      socket.username = payload.username;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  };

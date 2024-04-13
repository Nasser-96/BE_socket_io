import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketIOAdapter } from './socket.adapter';

@Module({
  providers: [SocketIOAdapter, SocketService],
  exports: [SocketService, SocketIOAdapter],
})
export class SocketModule {}

import { Injectable } from '@nestjs/common';
import { SocketIOAdapter } from './socket.adapter';

@Injectable()
export class SocketService {
  constructor(private readonly socketAdapter: SocketIOAdapter) {}

  async emitToServer(eventName: string, payload: any) {
    console.log(this.socketAdapter.getIoInstance());

    const io = this.socketAdapter.getIoInstance();

    if (io) {
      console.log(eventName);
      io.emit(eventName, payload);
    }
  }
}

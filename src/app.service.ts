import { Injectable } from '@nestjs/common';
import ReturnResponse, { ReturnResponseType } from './helper/returnResponse';
import { SocketService } from './socket/socket.service';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly socketService: SocketService,private readonly prismaService:PrismaService) {}

  getHello(): ReturnResponseType<string> {
    return ReturnResponse('Hello World!');
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany()
    return ReturnResponse(users)
  }
}

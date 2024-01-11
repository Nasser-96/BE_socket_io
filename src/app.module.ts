import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './socket.gateway';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppGateway, ConfigService],
})
export class AppModule {}

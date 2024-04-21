import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';
import { SocketService } from './socket/socket.service';
import { AgarGateway } from './socket/agar.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    SocketModule,
    JwtModule.register({
      secret: process.env.JSON_TOKEN_KEY,
      signOptions: { expiresIn: '1000s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, SocketService, AgarGateway],
})
export class AppModule {}

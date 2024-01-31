import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './socket/socket.gateway';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import {ConfigModule} from "@nestjs/config"
import { jwtModule } from './modules.config';

@Module({
  imports: [jwtModule,ConfigModule.forRoot() ,AuthModule, PrismaModule,
    JwtModule.register(
    {
      global:true,
      secret:process.env.JSON_TOKEN_KEY,
      signOptions:{expiresIn:'10000s'}
    })],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}

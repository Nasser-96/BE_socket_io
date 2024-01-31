import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import ReturnResponse from './helper/returnResponse';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './socket/socket.adpter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist:true, // What this do is delete any unwanted property
        transform:true,
        transformOptions:{enableImplicitConversion:true},
        exceptionFactory:(validationErrors:ValidationError[] = [])=>
        {
          throw new BadRequestException(ReturnResponse({},validationErrors?.map((error)=>
          (
            {
              field:error?.property,
              error:Object?.values(error?.constraints)?.join(', ')
            })),""));
        }
      }
    )
  )
  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
  await app.listen(9000);
}
bootstrap();

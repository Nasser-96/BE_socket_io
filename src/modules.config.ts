import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

export const jwtModule = JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>(process.env.JSON_TOKEN_KEY),
      signOptions: {
        expiresIn: parseInt(configService.get<string>('10000s')),
      },
    }),
    inject: [ConfigService],
  });
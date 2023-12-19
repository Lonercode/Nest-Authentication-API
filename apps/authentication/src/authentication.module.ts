import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { DatabaseModule } from '@app/common/database';
import { UsersDocument, UsersSchema } from './schema/users.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi'
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from './users/users.repository';
import { JwtStrategy } from '@app/common/strategies/jwt.strategy';
import { LocalStrategy } from '@app/common/strategies/local.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_EXPIRATION: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        OTP_SECRET: Joi.string().required(),
        CLIENT_URL: Joi.string().required()
      }),
      envFilePath: './apps/authentication/.env'
    }),
    DatabaseModule,
    DatabaseModule.forFeature([{name: UsersDocument.name, schema: UsersSchema}]),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`
        },
    }),
    inject: [ConfigService],
  }),

  ClientsModule.registerAsync([
    {
      name: "NOTIFICATIONS_SERVICE",
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {

          port: configService.get('TCP_PORT'),
        },
      }),
      inject: [ConfigService],
    }
])
  
  ],
  controllers: [AuthenticationController, UsersController],
  providers: [AuthenticationService, UsersRepository, JwtStrategy, LocalStrategy],
})
export class AuthenticationModule {}

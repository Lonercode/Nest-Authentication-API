import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common/database';
import { UsersDocument, UsersSchema } from '../schema/users.schema';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants/services';
import { Transport } from '@nestjs/microservices';


@Module({
  imports: [ 
    DatabaseModule,
    DatabaseModule.forFeature([{
      name: UsersDocument.name, schema: UsersSchema
    }]),
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
  

  providers: [UsersService, UsersRepository],

  controllers: [UsersController],

  exports: [UsersService, UsersRepository]
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
      
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.string().required(),
        FROM_EMAIL: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
      envFilePath: './apps/notifications/.env'
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
      transport: {
        host: configService.get('EMAIL_HOST'),
        port: configService.get('EMAIL_PORT'),
        secure: false,
        auth: {
          user: configService.get('FROM_EMAIL'),
          pass: configService.get('EMAIL_PASSWORD')
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, '/templates'),
        adapter: new HandlebarsAdapter(), 
        options: {
          strict: true,
        },
      },
    }),
    inject: [ConfigService]
  })
  ],
  
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [MailerModule]
})
export class NotificationsModule {}

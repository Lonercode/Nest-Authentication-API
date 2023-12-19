import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/sendMail.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService,
    private readonly mailerService: MailerService) { }


  async sendEmail({ email, template, subject, context }: SendMailDto) {
    await this.mailerService.sendMail({
      from: this.configService.get('FROM_EMAIL'),
      to: email,
      subject,
      template,
      context

    })
  }
}

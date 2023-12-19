import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SendMailDto } from './dto/sendMail.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('send_email')
  async sendEmail(@Payload() data: SendMailDto) {
    this.notificationsService.sendEmail(data);
  }
  
}

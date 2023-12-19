import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    NotificationsModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001
      }
    });
  await app.listen();
}
bootstrap();

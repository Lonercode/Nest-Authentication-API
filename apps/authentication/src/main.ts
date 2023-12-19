import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(configService.get('PORT'));
}
bootstrap();

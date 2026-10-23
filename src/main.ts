
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Ativa a validação automática baseada nos DTOs
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

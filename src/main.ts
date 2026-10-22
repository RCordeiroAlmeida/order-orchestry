<<<<<<< HEAD
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
=======
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common'; //

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Adiciona o ValidationPipe globalmente para validar os DTOs de entrada
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API do Stock Flow')
    .setDescription(
      'O objetivo desse backend é para estudar SOLID, VITEST, REDIS e WEBSOCKET',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`O servidor está rodando na URL: ${await app.getUrl()}`);
  console.log(
    `A documentação está rodando na URL: ${await app.getUrl()}/api/docs`,
  );
}
await bootstrap();

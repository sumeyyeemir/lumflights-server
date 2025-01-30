import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './auth/models/user.model';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger konfigürasyonu
  const config = new DocumentBuilder()
    .setTitle('LumFlights API')
    .setDescription('Flight reservation system API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
}
bootstrap();
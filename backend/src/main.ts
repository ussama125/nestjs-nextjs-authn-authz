import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS
  const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000'];

  app.enableCors({
    optionsSuccessStatus: 200,
    credentials: true,
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();

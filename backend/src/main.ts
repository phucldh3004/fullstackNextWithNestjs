import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend - cho phép 2 origins
  app.enableCors({
    origin: [
     'https://fullstacknextwithnestjs.onrender.com',
      'https://fullstack-next-with-nestjs.vercel.app', // Production Vercel
      'http://localhost:3000', // Development
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true, // Quan trọng nếu bạn dùng Cookie hoặc JWT trong Header
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();

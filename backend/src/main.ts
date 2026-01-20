import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend - cho phép multiple origins từ FRONTEND_URL
  app.enableCors({
    // origin phải là domain FRONTEND (nơi browser chạy), ví dụ localhost/vercel.
    // Dùng function để:
    // - allow Postman/curl (origin undefined)
    // - match chính xác origin của browser
    origin: (origin, callback) => {
      const frontendUrls = process.env.FRONTEND_URL || 'http://localhost:3000';
      const allowed = new Set(
        frontendUrls.split(',').map(url => url.trim())
      );

      if (!origin) return callback(null, true);
      return callback(null, allowed.has(origin as string));
    },
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

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { LeadModule } from './lead/lead.module';
import { MarketingModule } from './marketing/marketing.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Environment Variable Strategy:
      // - Local development: Load from .env file
      // - Production deployment: Use environment variables from hosting platform
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env' : undefined,
      // Cache config để tối ưu performance
      cache: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CustomerModule,
    LeadModule,
    MarketingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
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
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PaymentModule } from './payment/payment.module';
import { TicketModule } from './ticket/ticket.module';
import { OrderModule } from './order/order.module';
import { HealthPingModule } from './health-ping/health-ping.module';

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
    PaymentModule,
    TicketModule,
    OrderModule,
    HealthPingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Database connection cho Users
    MongooseModule.forRootAsync({
      connectionName: 'usersConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI_USER'),
      }),
      inject: [ConfigService],
    }),

    // Database connection thứ 2 (ví dụ: cho Products, Orders, etc.)
    MongooseModule.forRootAsync({
      connectionName: 'appConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI_APP'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

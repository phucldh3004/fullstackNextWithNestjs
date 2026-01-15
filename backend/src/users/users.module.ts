import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    // Chỉ định connectionName để sử dụng database 'usersConnection'
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'usersConnection',
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

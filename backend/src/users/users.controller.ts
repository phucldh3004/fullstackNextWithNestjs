import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('id') id?: string) {
    if (id) {
      console.log('🔍 Finding user with id (query):', id);
      return this.usersService.findOne(id);
    }
    // Nếu không có id thì lấy tất cả
    console.log('📋 Finding all users');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('🔍 Finding user with id (param):', id);
    return this.usersService.findOne(id);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    console.log('🔍 Finding user with email:', email);
    return this.usersService.findOneByEmail(email);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    console.log('🔍 Controller - Updating user');
    console.log('📝 Received data:', updateUserDto);
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

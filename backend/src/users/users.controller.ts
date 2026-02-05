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
import { UpdateUserDto, AssignRoleDto, UpdatePermissionsDto } from './dto/update-user.dto';
import { Roles, UserRole } from '../auth/guards/roles.guard';

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
      return this.usersService.findOne(id);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    
    return this.usersService.findOneByEmail(email);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/lock')
  @Roles(UserRole.ADMIN)
  lockUser(@Param('id') id: string) {
    return this.usersService.lockUser(id);
  }

  @Patch(':id/unlock')
  @Roles(UserRole.ADMIN)
  unlockUser(@Param('id') id: string) {
    return this.usersService.unlockUser(id);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  assignRole(@Param('id') id: string, @Body() assignRoleDto: AssignRoleDto) {
    return this.usersService.assignRole(id, assignRoleDto.role);
  }

  @Get(':id/permissions')
  @Roles(UserRole.ADMIN)
  getPermissions(@Param('id') id: string) {
    return this.usersService.getPermissions(id);
  }

  @Patch(':id/permissions')
  @Roles(UserRole.ADMIN)
  updatePermissions(@Param('id') id: string, @Body() updatePermissionsDto: UpdatePermissionsDto) {
    return this.usersService.updatePermissions(id, updatePermissionsDto.permissions);
  }
}

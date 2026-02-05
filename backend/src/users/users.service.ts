import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hasPasswordHelper } from '../helpers/util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    console.log('➕ Creating user:', createUserDto);

    // Hash password before saving
    const hashedPassword = await hasPasswordHelper(createUserDto.password);

    const findByUser = this.findOneByEmail(createUserDto.email);
    if (!!findByUser) {
      const createdUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      console.log('✅ User created:', createdUser);
      return createdUser;
    } else {
      throw new BadRequestException(`Email is exist`);
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    console.log('👥 Found users:', users.length);
    console.log(users);
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    console.log('User found:', user);
    return user;
  }

  async findOneByEmail(email: string) {
    console.log('🔍 Finding user by email:', email);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    console.log('✏️ Updating user:', updateUserDto._id, updateUserDto);

    // Hash password if it's being updated
    const updateData: any = { ...updateUserDto };
    delete updateData._id; // Remove _id as it's not needed in Prisma

    if (updateUserDto.password) {
      updateData.password = await hasPasswordHelper(updateUserDto.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: updateUserDto._id },
      data: updateData,
    });

    console.log('Updated user:', updatedUser);
    return updatedUser;
  }

  async remove(id: string) {
    console.log('🗑️ Removing user:', id);

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    console.log('Deleted user:', deletedUser);
    return deletedUser;
  }

  async lockUser(id: string) {
    console.log('🔒 Locking user:', id);

    const user = await this.findOne(id);
    if (!user.is_active) {
      throw new BadRequestException('User is already locked');
    }

    const lockedUser = await this.prisma.user.update({
      where: { id },
      data: { is_active: false },
    });

    console.log('✅ User locked:', lockedUser);
    return { message: 'User locked successfully', user: lockedUser };
  }

  async unlockUser(id: string) {
    console.log('🔓 Unlocking user:', id);

    const user = await this.findOne(id);
    if (user.is_active) {
      throw new BadRequestException('User is already active');
    }

    const unlockedUser = await this.prisma.user.update({
      where: { id },
      data: { is_active: true },
    });

    console.log('✅ User unlocked:', unlockedUser);
    return { message: 'User unlocked successfully', user: unlockedUser };
  }

  async assignRole(id: string, role: string) {
    console.log('👤 Assigning role to user:', id, role);

    await this.findOne(id); // Verify user exists

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role: role.toLowerCase() },
    });

    console.log('✅ Role assigned:', updatedUser);
    return { message: 'Role assigned successfully', user: updatedUser };
  }

  async getPermissions(id: string) {
    console.log('🔍 Getting permissions for user:', id);

    const user = await this.findOne(id);
    
    // Define permissions based on role
    const rolePermissions = {
      admin: ['*'], // Admin has all permissions
      sales: ['read:customers', 'write:customers', 'read:leads', 'write:leads', 'read:orders', 'write:orders'],
      marketing: ['read:leads', 'write:leads', 'read:campaigns', 'write:campaigns'],
      accountant: ['read:orders', 'read:payments', 'write:payments'],
      support: ['read:tickets', 'write:tickets', 'read:customers'],
    };

    const permissions = rolePermissions[user.role] || [];
    
    return { 
      userId: user.id, 
      role: user.role, 
      permissions 
    };
  }

  async updatePermissions(id: string, permissions: string[]) {
    console.log('🔧 Updating permissions for user:', id, permissions);

    await this.findOne(id); // Verify user exists

    // Note: In a real application, you might want to store custom permissions
    // in a separate table or JSON field. For now, we'll just return a success message.
    
    console.log('✅ Permissions updated (simulated)');
    return { 
      message: 'Permissions updated successfully', 
      userId: id,
      permissions 
    };
  }
}

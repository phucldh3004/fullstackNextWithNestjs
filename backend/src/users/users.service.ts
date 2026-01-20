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

    const createdUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    console.log('✅ User created:', createdUser);
    return createdUser;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    console.log('👥 Found users:', users.length);
    console.log(users);
    return users;
  }

  async findOne(id: string) {
    console.log('🔍 Finding user by ID:', id);

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
}

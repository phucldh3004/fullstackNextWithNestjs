import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, 'usersConnection') // Chỉ định connection name
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('➕ Creating user:', createUserDto);
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    console.log('✅ User created:', savedUser);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    console.log('👥 Found users:', users.length);
    console.log(users);
    return users;
  }

  async findOne(id: string): Promise<User | null> {
    console.log('🔍 Finding user by ID:', id);
    const user = await this.userModel.findById(id).exec();
    console.log('User found:', user);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    console.log('✏️ Updating user:', id, updateUserDto);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    console.log('Updated user:', updatedUser);
    return updatedUser;
  }

  async remove(id: string): Promise<User | null> {
    console.log('🗑️ Removing user:', id);
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    console.log('Deleted user:', deletedUser);
    return deletedUser;
  }
}

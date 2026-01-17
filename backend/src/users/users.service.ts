import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { hasPasswordHelper } from '../helpers/util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, 'usersConnection') // Chỉ định connection name
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('➕ Creating user:', createUserDto);

    // Hash password before saving
    const hashedPassword = await hasPasswordHelper(createUserDto.password);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
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

    const objectId = new Types.ObjectId(id);
    const user = await this.userModel.findById(objectId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    console.log('User found:', user);
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    console.log('🔍 Finding user by email:', email);
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto): Promise<User | null> {
    console.log('✏️ Updating user:', updateUserDto._id, updateUserDto);

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(updateUserDto._id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    // Hash password if it's being updated
    const updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await hasPasswordHelper(updateUserDto.password);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(updateUserDto._id, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(
        `User with ID ${updateUserDto._id} not found`,
      );
    }

    console.log('Updated user:', updatedUser);
    return updatedUser;
  }

  async remove(id: string): Promise<User | null> {
    console.log('🗑️ Removing user:', id);

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    console.log('Deleted user:', deletedUser);
    return deletedUser;
  }
}

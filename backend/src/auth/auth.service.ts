import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/helpers/util';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(username);

    if (!user || !(await comparePasswordHelper(pass, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user['_id'], username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    console.log('📝 Registering new user:', registerDto.email);

    // Check if email already exists
    try {
      const existingUser = await this.usersService.findOneByEmail(
        registerDto.email,
      );
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    } catch (error) {
      // If NotFoundException is thrown, it means email doesn't exist, which is good
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create new user
    const newUser = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      phone: registerDto.phone,
      address: registerDto.address,
      image: registerDto.image,
      account_type: registerDto.account_type || 'local',
      role: 'user', // Default role is user
      is_active: true,
    });

    console.log('✅ User registered successfully:', newUser.email);

    // Return user info (excluding password)
    return {
      message: 'User registered successfully',
      user: {
        _id: newUser['_id'],
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        image: newUser.image,
        account_type: newUser.account_type,
        role: newUser.role,
        is_active: newUser.is_active,
      },
    };
  }
}

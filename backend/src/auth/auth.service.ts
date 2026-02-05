import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '../helpers/util';
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
      throw new UnauthorizedException("Không đúng Tên đăng nhập hoặc mật khẩu");
    }
    const payload = { sub: user.id, username: user.email };
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
        _id: newUser.id,
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
  async validateGoogleUser(details: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
  }) {
    console.log('Validating Google User:', details.email);
    try {
      const user = await this.usersService.findOneByEmail(details.email);
      if (user) {
        // User exists, return user
        console.log('Google user exists:', user.email);
        return user;
      }
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // User does not exist, create new user
    console.log('Creating new Google user:', details.email);
    const names = details.firstName + ' ' + details.lastName;
    
    // Generate a random password since they use Google to login
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    
    const newUser = await this.usersService.create({
      name: names,
      email: details.email,
      password: randomPassword,
      image: details.picture,
      account_type: 'google',
      role: 'user',
      is_active: true,
      phone: '', // Google doesn't always provide phone
      address: '',
    });

    console.log('Created Google user:', newUser.email);
    return newUser;
  }

  async loginGoogle(user: any) {
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      }
    };
  }
}

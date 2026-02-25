import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper, hasPasswordHelper } from '../helpers/util';
import * as crypto from 'crypto';
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

  async forgotPassword(email: string) {
    // 1. Check if user exists
    let user;
    try {
      user = await this.usersService.findOneByEmail(email);
    } catch {
      throw new BadRequestException('User not found');
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 2. Generate random token
    const token = crypto.randomBytes(32).toString('hex');

    // 3. Hash token for DB storage
    const hashedToken = await hasPasswordHelper(token);

    // 4. Set expiration (+15 mins)
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    // 5. Save to database
    await this.usersService.updatePasswordToken(user.id, hashedToken, expiry);

    // 6. Return raw token so frontend can email it
    return { token };
  }

  async verifyResetToken(email: string, token: string) {
    let user;
    try {
      user = await this.usersService.findOneByEmail(email);
    } catch {
      throw new BadRequestException('User not found');
    }

    if (!user.code_id || !user.code_expired) {
      throw new BadRequestException('Invalid or missing reset token');
    }

    if (new Date() > new Date(user.code_expired)) {
      throw new BadRequestException('Reset token has expired');
    }

    const isValidToken = await comparePasswordHelper(token, user.code_id);
    if (!isValidToken) {
      throw new BadRequestException('Invalid token');
    }

    return { valid: true };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    // 1. Check if user exists
    let user;
    try {
      user = await this.usersService.findOneByEmail(email);
    } catch {
      throw new BadRequestException('User not found');
    }

    // 2. Check if token exists and hasn't expired
    if (!user.code_id || !user.code_expired) {
      throw new BadRequestException('Invalid or missing reset token');
    }

    if (new Date() > new Date(user.code_expired)) {
      throw new BadRequestException('Reset token has expired');
    }

    // 3. Verify token matches hash
    const isValidToken = await comparePasswordHelper(token, user.code_id);
    if (!isValidToken) {
      throw new BadRequestException('Invalid token');
    }

    // 4. Hash new password
    const hashedNewPassword = await hasPasswordHelper(newPassword);

    // 5. Update user password and clear tokens
    await this.usersService.updatePassword(user.id, hashedNewPassword);

    return { message: 'Password reset successfully' };
  }
}

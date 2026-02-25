import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Req, Res, Query, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(
      createAuthDto.username,
      createAuthDto.password,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @Public()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @Public()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
  @HttpCode(HttpStatus.OK)
  @Get('verify-reset-token')
  @Public()
  verifyResetToken(@Query('email') email: string, @Query('token') token: string) {
    if (!email || !token) {
      throw new BadRequestException('Email and token are required');
    }
    return this.authService.verifyResetToken(email, token);
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token, user } = await this.authService.loginGoogle(req.user);
    
    // Configurable frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/google/callback?accessToken=${access_token}`);
  }
}

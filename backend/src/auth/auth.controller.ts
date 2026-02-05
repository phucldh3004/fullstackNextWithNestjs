import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RegisterDto } from './dto/register.dto';
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

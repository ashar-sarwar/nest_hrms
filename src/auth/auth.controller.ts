import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { AuthenticatedUser } from './types/authenticated-user.type';

import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@GetUser() user: AuthenticatedUser): Promise<AuthResponseDto> {
    console.log('User from login:', user);
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterUserDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerBody);
  }
}

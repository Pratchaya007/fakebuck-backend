import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from 'src/database/generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() regiterDto: RegisterDto): Promise<string> {
    await this.authService.register(regiterDto);
    return 'register account created successfully';
  }

  @HttpCode(HttpStatus.OK) // ====> 200
  @Post('login') //default 201
  async login(
    @Body() loginDto: LoginDto
  ): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    return this.authService.login(loginDto);
  }
}

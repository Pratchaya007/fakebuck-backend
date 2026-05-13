import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
// import { User } from 'src/database/generated/prisma/client';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt.payload.type';
import { UserWithOutPassword } from 'src/user/types/uset.type';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { LoginResponseDto } from './dtos/login-reponse.dts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage('register account created successfully')
  @Public()
  @Post('register')
  async register(@Body() regiterDto: RegisterDto): Promise<void> {
    await this.authService.register(regiterDto);
  }

  @ApiOkResponse({
    description: 'Successfully operation',
    type: LoginResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'The provided credentials is ivalid'
  })
  @ApiBadRequestResponse()
  @Public()
  @HttpCode(HttpStatus.OK) // ====> 200
  @Post('login') //default 201
  async login(@Body() loginDto: LoginDto): Promise<{
    accessToken: string;
    user: UserWithOutPassword;
    expiresIn: number;
  }> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('me')
  async getCurrentUser(
    @CurrentUser() user: JwtPayload
  ): Promise<UserWithOutPassword> {
    return this.authService.getCurrentUser(user.sub);
  }
}

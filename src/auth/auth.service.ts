import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { User } from 'src/database/generated/prisma/client';
import { AuthTokenService } from 'src/shared/security/services/auth-token.service';
import { UserWithOutPassword } from 'src/user/types/uset.type';
import { TypedConfigService } from 'src/config/typed-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptservice: BcryptService,
    private readonly authtokenService: AuthTokenService,
    private readonly typedConfigService: TypedConfigService
  ) {}

  async register(regiterDto: RegisterDto): Promise<void> {
    await this.userService.create(regiterDto);
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    user: Omit<User, 'password'>;
    expiresIn: number;
  }> {
    //1. ค้นหา user in database ไม่มีก็แจ้ง error ออกไป
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user)
      throw new UnauthorizedException({
        message: 'The provided email or password is incorrect',
        code: 'Invalid credentials'
      });
    //2. compare password ว่าตรงกันไหม
    const isMatch = await this.bcryptservice.compare(
      loginDto.password,
      user.password
    );
    if (!isMatch)
      throw new UnauthorizedException({
        message: 'The provided email or password is incorrect',
        code: 'Invalid credentials'
      });
    //3. gen access Token
    const accessToken = await this.authtokenService.sign({
      sub: user.id,
      email: user.email
    });
    const { password, ...rest } = user;
    return {
      accessToken,
      user: rest,
      expiresIn: this.typedConfigService.get('JWT_EXPIRES_IN')
    };
  }

  async getCurrentUser(id: string): Promise<UserWithOutPassword> {
    return this.userService.findById(id);
  }
}

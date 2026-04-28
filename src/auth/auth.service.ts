import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(regiterDto: RegisterDto): Promise<void> {
    await this.userService.create(regiterDto);
  }
}

import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

export class RegisterDto extends OmitType(CreateUserDto, [
  'avatarUrl',
  'coverUrl'
]) {}

import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/database/generated/prisma/enums';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  dob!: string;

  @ApiProperty()
  gender!: Gender;
}

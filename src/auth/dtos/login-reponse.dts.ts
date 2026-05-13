import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos/user-reponse.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'PLqjsA9anGs86CB1daceG6sj5Sdrr2sM'
  })
  accessToken!: string;

  @ApiProperty()
  user!: UserResponseDto;
}

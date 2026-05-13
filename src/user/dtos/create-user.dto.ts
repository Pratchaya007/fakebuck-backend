import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';
import { Gender } from 'src/database/generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({
    example: 'a@gmail.com',
    description: 'An email address to be registered. Must be unique'
  })
  @Trim()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    example: 'Nut_93244.tts',
    description: 'A user password. Must have at least 6 characters'
  })
  @Trim()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @IsAlphanumeric('en-US', {
    message: 'Password can contain only number and latter'
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @Trim()
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @Trim()
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @IsDate({ message: 'Invalid date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @Type(() => Date)
  dob!: Date;

  @IsEnum(Gender, {
    message: 'Gender must be one fo th following values: MALE, FEMLE, OTHER'
  })
  @IsNotEmpty({ message: 'Gender is required' })
  gender!: Gender;

  avatarUrl?: string;

  coverUrl?: string;
}

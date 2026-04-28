import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/database/generated/prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    // hash password
    const hashPassword = 'dddddddd';
    // insert data into database
    return this.prisma.user.create({
      data: { ...createUserDto, password: hashPassword }
    });
  }
}

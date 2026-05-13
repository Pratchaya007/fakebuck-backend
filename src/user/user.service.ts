import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/database/generated/prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserWithOutPassword } from './types/uset.type';
import { CloudinaryService } from 'src/shared/upload/cloudinary.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FriendService } from 'src/friend/services/friend.service';
import { RelationshipStatus } from 'src/friend/types/friend.type';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly friendService: FriendService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // hash password
    const hashPassword = await this.bcryptService.hash(createUserDto.password);
    // insert data into database
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password: hashPassword }
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          message: `Email: ${createUserDto.email} is already in use`,
          code: 'Emali already exists'
        });
      }

      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserWithOutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true }
    });
    if (!user)
      throw new NotFoundException({
        message: 'User with provided id not found',
        code: 'User Not Found'
      });

    return user;
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File
  ): Promise<string> {
    //1. Upload to cloud
    const result = await this.cloudinaryService.upload(file);
    //2. Update avatar url in database
    await this.update(userId, { avatarUrl: result.secure_url });
    // console.log(user);
    return result.secure_url;
  }

  async uploadCover(
    userId: string,
    file: Express.Multer.File
  ): Promise<string> {
    //1. Upload to cloud
    const result = await this.cloudinaryService.upload(file);
    //2. Update cover url in database
    await this.update(userId, { coverUrl: result.secure_url });
    return result.secure_url;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserWithOutPassword> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: { password: true }
    });
  }

  async findByIdWithRelationToCurrentUser(
    userId: string,
    currentUserId: string
    // includeFriend?: boolean
  ): Promise<{
    user: UserWithOutPassword & { friends: UserWithOutPassword[] };
    relationshipStatus: RelationshipStatus;
  }> {
    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        usersA: {
          where: {
            status: 'ACCEPTED'
          },
          include: {
            userB: {
              omit: {
                password: true
              }
            }
          }
        }
      },
      omit: {
        password: true
      }
    });
    if (!result) {
      throw Error('');
    }
    const relationshipStatus =
      await this.friendService.findRelationshipBetweenTwoUser(
        userId,
        currentUserId
      );
    // const relation = await this.prisma.friend.findFirst({
    //   where: {
    //     userAId: userId,
    //     userBId: currentUserId
    //   }
    // })

    const { usersA, ...user } = result;
    return {
      user: { ...user, friends: usersA.map((el) => el.userB) },
      relationshipStatus
    };
    // return user;
  }

  async findAll(search: string = ''): Promise<UserWithOutPassword[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      },
      omit: {
        password: true
      }
    });
  }

  async findAllWithNoRelationShip(
    currentUserId: string
  ): Promise<UserWithOutPassword[]> {
    const withRelationUsers = await this.prisma.friend.findMany({
      where: {
        userAId: currentUserId
      },
      select: {
        userBId: true
      }
    });

    const noRelationUsers = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: withRelationUsers.map((el) => el.userBId)
        }
      },
      omit: {
        password: true
      }
    });
    return noRelationUsers;
  }
}

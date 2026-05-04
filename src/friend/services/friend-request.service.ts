import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/database/prisma.service';
import { UserWithOutPassword } from 'src/user/types/uset.type';

@Injectable()
export class FriendRequestService {
  constructor(private readonly prisma: PrismaService) {}
  async sendRequest(requesterId: string, recipentId: string): Promise<void> {
    if (requesterId === recipentId)
      throw new BadRequestException({
        message: 'You can not send a friend request to yourself',
        code: 'Can not requset self'
      });

    try {
      await this.prisma.friend.createMany({
        data: [
          { userAId: requesterId, userBId: recipentId, requesterId },
          {
            userAId: recipentId,
            userBId: requesterId,
            requesterId
          }
        ]
      });
    } catch (error) {
      // if (
      //   error instanceof PrismaClientKnownRequestError &&
      //   error.code === 'P2002'
      // )
      //   throw new ConflictException({
      //     message: 'These users already have relation',
      //     code: 'Relation already exsists'
      //   });
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException({
              message: 'These users already have relation',
              code: 'Relation already exists'
            });
          case 'P2003':
            throw new NotFoundException({
              message: 'The recipient user or request user not found',
              code: 'User not found'
            });
        }
      }

      throw error;
    }
  }

  async cancelRequest(requesterId: string, recipentId: string): Promise<void> {
    const result = await this.prisma.friend.deleteMany({
      where: {
        status: 'PENDING',
        requesterId,
        OR: [
          {
            userAId: requesterId,
            userBId: recipentId
          },
          {
            userAId: recipentId,
            userBId: requesterId
          }
        ]
      }
    });
    if (result.count === 0)
      throw new NotFoundException({
        message: 'These user relation conot be found',
        code: 'relation no found'
      });
  }

  async acceptRequest(requesterId: string, recipentId: string): Promise<void> {
    const result = await this.prisma.friend.updateMany({
      data: { status: 'PENDING' },
      where: {
        status: 'PENDING',
        requesterId,
        OR: [
          { userAId: requesterId, userBId: recipentId },
          { userAId: recipentId, userBId: requesterId }
        ]
      }
    });
    // console.log(result);
    if (result.count === 0)
      throw new NotFoundException({
        message: 'These user relation connot be found',
        code: 'Relation not found'
      });
  }
  async rejectRequest(requesterId: string, recipentId: string): Promise<void> {
    const result = await this.prisma.friend.deleteMany({
      where: {
        status: 'PENDING',
        requesterId,
        OR: [
          { userAId: requesterId, userBId: recipentId },
          { userAId: recipentId, userBId: requesterId }
        ]
      }
    });
    // console.log(result);
    if (result.count === 0)
      throw new NotFoundException({
        message: 'These user relation connot be found',
        code: 'Relation not found'
      });
  }
  async findIncomingRequest(
    currentUserId: string
  ): Promise<UserWithOutPassword[]> {
    const result = await this.prisma.friend.findMany({
      where: {
        status: 'PENDING',
        requesterId: {
          not: currentUserId
        },
        userAId: currentUserId
      },
      select: {
        requester: {
          omit: {
            password: true
          }
        }
      }
    });
    // console.log(result);
    return result.map((el) => el.requester);
  }
}
//where userAid = requesterId and userBId = recipientId and requesterId = requesterId and status = 'PENDING'
//or userAId = recipientId and userBId = requesterId and requesterId = requesterId and status = 'PENDING'

// where ((userAId = requesterId and userBid = recipientid) or (userAid = recipientId and userBid = requesterId))
// And requesterId = requesterId and status = 'PENDING'

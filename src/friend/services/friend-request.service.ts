import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/database/prisma.service';

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
}

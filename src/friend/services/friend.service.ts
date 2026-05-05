import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserWithOutPassword } from 'src/user/types/uset.type';
import { RalationshipStatus } from '../types/friend.type';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async findFriends(currentUserId: string): Promise<UserWithOutPassword[]> {
    const result = await this.prisma.friend.findMany({
      where: {
        status: 'ACCEPTED',
        userAId: currentUserId
      },
      select: {
        userB: {
          omit: {
            password: true
          }
        }
      }
    });

    return result.map((el) => el.userB);
  }

  async unfriend(currentUserId: string, friendId: string): Promise<void> {
    const result = await this.prisma.friend.deleteMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { userAId: currentUserId, userBId: friendId },
          { userAId: friendId, userBId: currentUserId }
        ]
      }
    });

    if (result.count === 0) {
      throw new NotFoundException({
        message: 'These user are Not not become frined together',
        code: 'Not friend'
      });
    }
  }

  async findRelationshipBetweenTwoUser(
    targetUserId: string,
    userId: string
  ): Promise<RalationshipStatus> {
    if (targetUserId === userId) return 'SELF';

    const relationship = await this.prisma.friend.findFirst({
      where: {
        userAId: targetUserId,
        userBId: userId
      }
    });
    if (!relationship) return 'NONE';
    if (relationship.status === 'ACCEPTED') return 'FRIEND';
    if (relationship.requesterId === userId) return 'REQUEST_SENT';

    return 'REQUEST_RECEIVED';
  }
}

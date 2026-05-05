import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserWithOutPassword } from 'src/user/types/uset.type';

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
}

import { Controller, Get } from '@nestjs/common';
import { UserWithOutPassword } from 'src/user/types/uset.type';
import { FriendService } from '../services/friend.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt.payload.type';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Get()
  async findFriends(
    @CurrentUser() user: JwtPayload
  ): Promise<UserWithOutPassword[]> {
    return this.friendService.findFriends(user.sub);
  }
}

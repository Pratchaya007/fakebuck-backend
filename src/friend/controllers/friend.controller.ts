import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserWithOutPassword } from 'src/user/types/uset.type';
import { FriendService } from '../services/friend.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt.payload.type';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Get()
  async findFriends(
    @CurrentUser() user: JwtPayload
  ): Promise<UserWithOutPassword[]> {
    return this.friendService.findFriends(user.sub);
  }

  @ResponseMessage('Friend terminate')
  @Delete(':friendId')
  async unfriend(
    @CurrentUser() user: JwtPayload,
    @Param('friendId', ParseUUIDPipe) friendId: string
  ): Promise<void> {
    return await this.friendService.unfriend(user.sub, friendId);
  }
}

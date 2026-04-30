import { Body, Controller, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import { RecipientIdDto } from '../dtos/recipient-id.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt.payload.type';
import { FriendRequestService } from '../services/friend-request.service';

@Controller('friends/requests')
export class FriendRequestController {
  constructor(private readonly friendrequstService: FriendRequestService) {}
  @ResponseMessage('Request has been sent')
  @Post()
  async sendFrined(
    @Body() recipientIdDto: RecipientIdDto,
    @CurrentUser() user: JwtPayload
  ): Promise<void> {
    await this.friendrequstService.sendRequest(
      user.sub,
      recipientIdDto.recipentId
    );
  }
}

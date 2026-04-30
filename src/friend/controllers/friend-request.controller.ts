import { Body, Controller, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import { RecipientIdDto } from '../dtos/recipient-id.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt.payload.type';

@Controller('friends/requests')
export class FriendRequestController {
  @ResponseMessage('Request has been sent')
  @Post()
  async sendFrined(
    @Body() recipientIdDto: RecipientIdDto,
    @CurrentUser() user: JwtPayload
  ): Promise<void> {}
}

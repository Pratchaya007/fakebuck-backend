import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import { RecipientIdDto } from '../dtos/recipient-id.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt.payload.type';
import { FriendRequestService } from '../services/friend-request.service';
import { UserWithOutPassword } from 'src/user/types/uset.type';

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
      recipientIdDto.recipientId
    );
  }

  @ResponseMessage('The request has been cancelled')
  @Delete(':recipientId')
  async cancelRequest(
    @Param() recipientIdDto: RecipientIdDto,
    @CurrentUser() user: JwtPayload
  ): Promise<void> {
    await this.friendrequstService.cancelRequest(
      user.sub,
      recipientIdDto.recipientId
    );
  }

  @ResponseMessage('The request has been accepted')
  @Post(':requesterId/accept')
  async acceptRequest(
    @Param('requesterId', ParseUUIDPipe) requesterId: string,
    @CurrentUser() user: JwtPayload
  ) {
    await this.friendrequstService.acceptRequest(requesterId, user.sub);
  }

  @ResponseMessage('Request rejected successfully')
  @Post(':requesterId/reject')
  async rejectRequest(
    @Param('requesterId', ParseUUIDPipe) requesterId: string,
    @CurrentUser() user: JwtPayload
  ) {
    await this.friendrequstService.rejectRequest(requesterId, user.sub);
  }

  @Get('incoming')
  async findIcomingRequest(
    @CurrentUser() user: JwtPayload
  ): Promise<UserWithOutPassword[]> {
    return await this.friendrequstService.findIncomingRequest(user.sub);
  }
}

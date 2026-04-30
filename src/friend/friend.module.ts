import { Module } from '@nestjs/common';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendRequestService } from './services/friend-request.service';

@Module({
  controllers: [FriendRequestController],
  providers: [FriendRequestService]
})
export class FriendModule {}

import { Module } from '@nestjs/common';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendRequestService } from './services/friend-request.service';
import { FriendController } from './controllers/friend.controller';
import { FriendService } from './services/friend.service';

@Module({
  controllers: [FriendRequestController, FriendController],
  providers: [FriendRequestService, FriendService],
  exports: [FriendService]
})
export class FriendModule {}

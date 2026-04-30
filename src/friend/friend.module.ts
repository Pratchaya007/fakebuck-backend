import { Module } from '@nestjs/common';
import { FriendRequestController } from './controllers/friend-request.controller';

@Module({
  controllers: [FriendRequestController]
})
export class FriendModule {}

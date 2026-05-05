import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SecurityModule } from 'src/shared/security/security.module';
import { UserController } from './user.controller';
import { UploadModule } from 'src/shared/upload/upload.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [SecurityModule, UploadModule, FriendModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}

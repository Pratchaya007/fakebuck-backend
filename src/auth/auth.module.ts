import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { SecurityModule } from 'src/shared/security/security.module';

@Module({
  imports: [UserModule, SecurityModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}

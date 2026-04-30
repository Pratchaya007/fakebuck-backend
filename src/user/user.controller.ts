import {
  Controller,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('me/avatar')
  uploadAvatar(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.userService.uploadAvatar(file);
  }

  @UseInterceptors(FileInterceptor('cover'))
  @Patch('me/cover')
  uploadCover(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.userService.uploadCover(file);
  }
}

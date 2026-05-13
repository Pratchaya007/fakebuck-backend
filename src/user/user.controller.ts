import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt.payload.type';
import { UserWithOutPassword } from './types/uset.type';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('me/avatar')
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload
  ): Promise<string> {
    return this.userService.uploadAvatar(user.sub, file);
  }

  @UseInterceptors(FileInterceptor('cover'))
  @Patch('me/cover')
  uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload
  ): Promise<string> {
    return this.userService.uploadCover(user.sub, file);
  }

  @Get(':userId/profile')
  async findProfileById(
    @CurrentUser() user: JwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string
    // @Query('friends', ParseBoolPipe) includeFriend?: boolean
    // @Query('relationshipStatus', ParseBoolPipe) relationshipStatus?: boolean
  ) {
    return await this.userService.findByIdWithRelationToCurrentUser(
      userId,
      user.sub
    );
  }

  @Public()
  @Get()
  findAll(@Query('search') search?: string): Promise<UserWithOutPassword[]> {
    return this.userService.findAll(search);
  }

  @Get('relationship/none')
  async findAllWithNoRelationShip(
    @CurrentUser() user: JwtPayload
  ): Promise<UserWithOutPassword[]> {
    return this.userService.findAllWithNoRelationShip(user.sub);
  }
}

import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { isSuccess } from 'src/utils/isSuccess.typeguard';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { ResponseType } from 'src/Misc/ResponseType.type';
import { Public } from '../auth/decorators/public.decorator';
import { UserProfileEntity } from './entities/userprofile.entity';
import { UserProfileDto } from './DTO/userprofile.dto';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('user')
export class UserController {
  constructor(private userSer: UserService) {}

  // get user profile
  @Get('profile')
  async getUserProfile(@GetUser() user: LoginPayload): Promise<UserProfileEntity> {
    const response = await this.userSer.getUserProfileService(user.user_id);

    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }

  // get profile image
  @Get('profile-image/:path')
  async getImage(@Param() param, @Res() res: Response) {
    try {
      const isFileExists = fs.existsSync(`apps/server/uploads/profile_pics/${param.path}`);
      if (!isFileExists) {
        throw new Error('File not found');
      }
      return res.sendFile(param.path, { root: 'apps/server/uploads/profile_pics/' });
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }
  }

  // search user
  @Get('search-user/:user_email')
  async searchUser(@Param() param): Promise<{ email: string }> {
    const response = await this.userSer.searchUser(param.user_email);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return { email: response.data.email };
  }

  @Post('send-request')
  async sendChatRequest(@GetUser() user: LoginPayload, @Body() body: { acceptor_email: string }): Promise<ResponseType> {
    const response = await this.userSer.sendChatRequestService(user.user_id, body.acceptor_email);
    if (!isSuccess(response)) {
      throw new HttpException(response?.error.message, response?.error.statusCode);
    }
    return response;
  }

  @Post('complete-profile')
  async completeProfile(@GetUser() user: LoginPayload, @Body() profile: UserProfileDto) {
    const response = await this.userSer.completeProfile(user.user_id, profile);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response;
  }

  @Public()
  @Post('email')
  async email(@Body() body) {
    const user = await this.userSer.findByEmail(body.email);
    return user;
  }

  @Public()
  @Get('id')
  async id(@Body() body) {
    const user = await this.userSer.getUserProfileService(body.id);
    return user;
  }
}

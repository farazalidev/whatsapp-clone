import { Body, Controller, Get, HttpException, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { UserProfileEntity } from './entities/userprofile.entity';
import { UserProfileDto } from './DTO/userprofile.dto';
import { Response } from 'express';
import * as fs from 'fs';
import { ContactEntity } from './entities/contact.entity';
import { isSuccess } from '../../utils/isSuccess.typeguard';
import { searchUserResponse } from '../../Misc/successTypes/userSuccess.types';

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

  @Get('me')
  async getMe(@GetUser() user: LoginPayload) {
    const response = await this.userSer.getUser(user.user_id);

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
  async searchUser(@Param() param, @GetUser() user: LoginPayload): Promise<searchUserResponse> {
    const response = await this.userSer.searchUser(param.user_email, user.user_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return { name: response.data.name, pic_path: response.data.profile.pic_path, user_id: response.data.user_id };
  }

  @Post('complete-profile')
  async completeProfile(@GetUser() user: LoginPayload, @Body() profile: UserProfileDto) {
    const response = await this.userSer.completeProfile(user.user_id, profile);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response;
  }

  // add new contact
  @Post('add-contact/:email')
  async addNewContact(@GetUser() user: LoginPayload, @Param() param: { email: string }) {
    const response = await this.userSer.addNewContact(user.user_id, param.email);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response;
  }

  // get user contacts
  @Get('contacts')
  async getUserContacts(@GetUser() user: LoginPayload): Promise<ContactEntity[]> {
    const response = await this.userSer.getUserContacts(user.user_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }
}

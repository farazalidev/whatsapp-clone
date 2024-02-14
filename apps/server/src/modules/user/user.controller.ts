import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { UserProfileEntity } from './entities/userprofile.entity';
import { UserProfileDto } from './DTO/userprofile.dto';
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
    if (user.user_id) {
      const response = await this.userSer?.getUser(user.user_id);

      if (!isSuccess(response)) {
        throw new HttpException(response.error.message, response.error.statusCode);
      }
      return response.data;
    }
    throw new HttpException('session may be expired', 400);
  }

  // search user
  @Get('search-user/:user_email')
  async searchUser(@Param() param, @GetUser() user: LoginPayload): Promise<searchUserResponse> {
    const response = await this.userSer.searchUser(param.user_email, user.user_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return { name: response.data.name, user_id: response.data.user_id };
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
  @Post('add-contact/:user_id')
  async addNewContact(@GetUser() user: LoginPayload, @Param() param: { user_id: string }) {
    const response = await this.userSer.addNewContact(user.user_id, param.user_id);
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

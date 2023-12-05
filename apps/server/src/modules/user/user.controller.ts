import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { isSuccess } from 'src/utils/isSuccess.typeguard';
import { UserEntity } from './entities/user.entity';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { UserProfileDto } from './DTO/userprofile.dto';
import { ResponseType } from 'src/Misc/ResponseType.type';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private userSer: UserService) {}

  @Get('profile')
  async getUserProfile(@GetUser() user: LoginPayload): Promise<UserEntity> {
    const response = await this.userSer.getUserProfileService(user.user_id);

    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }

  @Post('complete-profile')
  async completeProfile(@GetUser() user: LoginPayload, @Body() body: UserProfileDto): Promise<ResponseType> {
    const response = await this.userSer.completeUserProfileService(user.user_id, body);
    if (!isSuccess(response)) {
      throw new HttpException(response?.error.message, response?.error.statusCode);
    }

    return response;
  }

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

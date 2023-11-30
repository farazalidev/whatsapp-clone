import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { isSuccess } from 'src/utils/isSuccess.typeguard';
import { UserEntity } from './entities/user.entity';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { UserProfileDto } from './DTO/userprofile.dto';

@Controller('user')
export class UserController {
  constructor(private userSer: UserService) {}

  @Get(':id/profile')
  async getUserProfile(@Param('id') id: string): Promise<UserEntity> {
    const response = await this.userSer.getUserProfileService(id);

    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }

  @Post('complete-profile')
  async completeProfile(@GetUser() user: LoginPayload, @Body() body: UserProfileDto) {
    const response = await this.userSer.completeUserProfileService(user.user_id, body);
    if (!isSuccess(response)) {
      throw new HttpException(response?.error.message, response?.error.statusCode);
    }

    return {
      success: true,
      successMessage: response.successMessage,
    };
  }
}

import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { isSuccess } from 'src/utils/isSuccess.typeguard';
import { UserEntity } from './entities/user.entity';

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
}

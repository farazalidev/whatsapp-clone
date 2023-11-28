import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from './modules/user/user.service';

@Injectable()
export class AppService {
  constructor(private userSer: UserService) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('*/10 * * * * *')
  async handleFalseVerifiedUsers() {
    await this.userSer.removeFalseVerifiedUsers();
  }
}

import { Controller, Get, HttpException } from '@nestjs/common';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { isSuccess } from 'src/utils/isSuccess.typeguard';
import { UserChatEntity } from './entities/userchat.entity';

@Controller('chat')
export class ChatController {
  constructor(private chatSer: ChatService) {}

  // get user chats
  @Get('user-chats')
  async getUserChats(@GetUser() user: LoginPayload): Promise<UserChatEntity[]> {
    const response = await this.chatSer.getUserChats(user.user_id);
    console.log('🚀 ~ file: chat.controller.ts:16 ~ ChatController ~ getUserChats ~ response:', response);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }
}

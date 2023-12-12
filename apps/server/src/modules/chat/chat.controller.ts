import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { UserChatEntity } from './entities/userchat.entity';
import { isSuccess } from '../../utils/isSuccess.typeguard';

@Controller('chat')
export class ChatController {
  constructor(private chatSer: ChatService) {}

  // get user chats
  @Get('user-chats')
  async getUserChats(@GetUser() user: LoginPayload): Promise<UserChatEntity[]> {
    const response = await this.chatSer.getUserChats(user.user_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }

  // get user_chat by id
  @Get(':id')
  async getUserChatById(@Param() param: { id: string }, @GetUser() user: LoginPayload): Promise<UserChatEntity> {
    const response = await this.chatSer.getChatByIdService(user.user_id, param.id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }
}

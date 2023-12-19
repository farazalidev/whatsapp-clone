import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { UserChatEntity } from './entities/userchat.entity';
import { isSuccess } from '../../utils/isSuccess.typeguard';
import { MessageDto } from './DTO/message.dto';

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

  @Get('is-chat/:receiver_id')
  async isChatStarted(@GetUser() user: LoginPayload, @Param() param: { receiver_id: string }) {
    const response = await this.chatSer.isChatStarted(user.user_id, param.receiver_id);
    if (!isSuccess(response)) {
      return response;
    }
    return response;
  }

  @Post('message/:chat_id/:receiver_id')
  async sendMessage(@GetUser() user: LoginPayload, @Param() param: { receiver_id: string; chat_id: string }, @Body() body: MessageDto) {
    const response = await this.chatSer.sendMessage(param.chat_id, user.user_id, param.receiver_id, body);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }

    return response;
  }
}

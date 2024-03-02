import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { UserChatEntity } from './entities/userchat.entity';
import { isSuccess } from '../../utils/isSuccess.typeguard';
import { MessageDto } from './DTO/message.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ChatsDto, ChatsParamsDto, PaginatedMessagesParamsDto } from './DTO/chats.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatSer: ChatService) {}

  // get user chats
  @Get('user-chats')
  async getUserChats(@GetUser() user: LoginPayload, @Query() query: ChatsParamsDto): Promise<ChatsDto> {
    try {
      const response = await this.chatSer.getUserChats(user.user_id, query);
      if (!isSuccess(response)) {
        throw new HttpException(response.error.message, response.error.statusCode);
      }
      return response.data;
    } catch (error) {
      console.log('🚀 ~ ChatController ~ getUserChats ~ error:', error);
    }
  }

  @Get('get-paginated-messages/:chat_id')
  async getPaginatedMessages(@GetUser() user: UserEntity, @Query() query: PaginatedMessagesParamsDto, @Param() param: { chat_id: string }) {
    const response = await this.chatSer.getPaginatedMessages(param.chat_id, query);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }

  @Get('get-all-media-messages/:chat_id')
  async getAllMediaMessages(@GetUser() user: UserEntity, @Param() param: { chat_id: string }) {
    return await this.chatSer.getAllMediaMessages(user.user_id, param.chat_id);
  }

  // create a new Chat
  @Post('new-chat')
  async createChat(@GetUser() user: UserEntity, @Body() body: { chat: UserChatEntity }) {
    const response = await this.chatSer.createAnewChat(user.user_id, body.chat);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response;
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

  @Get('messages/:chat_id')
  async getChatMessages(@Param() param: { chat_id: string }) {
    const response = await this.chatSer.getMessagesByChatId(param.chat_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }

    return response.data;
  }

  @Get('mark-unread-messages/:chat_id')
  async markSeen(@Param() param: { chat_id: string }, @GetUser() user: LoginPayload) {
    const response = await this.chatSer.markUnreadMessages(user.user_id, param.chat_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }

    return response;
  }
  @Get('message-existed/:chat_id/:message_id')
  async isMessageExisted(@GetUser() user: UserEntity, @Param() param: { chat_id: string; message_id: string }) {
    const response = await this.chatSer.isMessageExistedService(user.user_id, param.chat_id, param.message_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }

    return response;
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserChatEntity } from './entities/userchat.entity';
import { MessageEntity } from './entities/message.entity';
import { ResponseType } from 'src/Misc/ResponseType.type';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserChatEntity) private UserChatRepo: Repository<UserChatEntity>,
    @InjectRepository(MessageEntity) private UserMessageRepo: Repository<MessageEntity>,
  ) {
    // get user chats service
  }
  async getUserChats(user_id: string): Promise<ResponseType<UserChatEntity[]>> {
    try {
      const user = await this.userRepo.findOne({ where: { user_id } });
      if (!user) {
        return {
          success: false,
          error: { message: 'User not found', statusCode: HttpStatus.NOT_FOUND },
        };
      }

      return {
        data: user.chats,
        success: true,
        successMessage: 'Chat Found',
      };
    } catch (error) {
      return { success: false, error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR } };
    }
  }
}

import { Injectable } from '@nestjs/common';
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
  ) {}

  // send message
  // async sendMessageService(sender_id: string, receiver_id: string, content: string): Promise<ResponseType> {
  //   const CanStartChat = await this.userRepo.findOne({ where: { chats: { user_id: receiver_id } } });

  //   // sending message
  //   this.UserChatRepo.create({});
  // }
}

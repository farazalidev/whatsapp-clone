import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../modules/kafka/consumer.service';
import { MessageJSON } from '../gateways/types/message.types';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserChatEntity } from '../modules/chat/entities/userchat.entity';
import { MessageEntity } from '../modules/chat/entities/message.entity';

@Injectable()
export class MessageConsumer implements OnModuleInit {
  constructor(
    private consumerService: ConsumerService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserChatEntity) private UserChatRepo: Repository<UserChatEntity>,
    @InjectRepository(MessageEntity) private UserMessageRepo: Repository<MessageEntity>,
  ) {}
  async onModuleInit() {
    // saving messages to DB
   try {
     await this.consumerService?.consume({
       config: { groupId: 'messages-consumer' },
       topic: { topic: 'MESSAGE', fromBeginning: false },
       onMessage: async (data) => {
         const message = JSON.parse(data.value as unknown as string) as unknown as MessageJSON;
         const newMessages = this.UserMessageRepo.create({
           ...message.message,
           chat: message.chat,
           sended: true,
         });
         await this.UserMessageRepo.save(newMessages);
       },
     });
   } catch (error) {
     console.log('🚀 ~ MessageConsumer ~ onModuleInit ~ error:', error);
   }
  }
}

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
    await this.consumerService?.consume({
      config: { groupId: 'messages-consumer' },
      topic: { topic: 'MESSAGE', fromBeginning: true },
      onMessage: async (data) => {
        const message = JSON.parse(data.value as unknown as string) as unknown as MessageJSON;
        // TODO: add caching from redis
        const chat = await this.UserChatRepo.findOne({ where: { id: message.chat_id } });
        if (!chat.messages || chat.messages.length === 0) {
          chat.messages = [];
        }
        chat.messages.push({ ...message.message, sended: true });
        await this.UserChatRepo.save(chat);
      },
    });
  }
}

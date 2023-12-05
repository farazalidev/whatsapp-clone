import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChatEntity } from './entities/userchat.entity';
import { MessageEntity } from './entities/message.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserChatEntity, MessageEntity])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

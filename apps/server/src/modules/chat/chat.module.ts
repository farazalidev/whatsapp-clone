import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChatEntity } from './entities/userchat.entity';
import { MessageEntity } from './entities/message.entity';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { MessageMediaEntity } from './entities/messageMedia.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserChatEntity, MessageEntity, MessageMediaEntity])],
  controllers: [ChatController],
  providers: [JwtService, AuthService, ChatService],
  exports: [AuthService, ChatService, UserModule, TypeOrmModule.forFeature([UserChatEntity, MessageEntity])],
})
export class ChatModule {}

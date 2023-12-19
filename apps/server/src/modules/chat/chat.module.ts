import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChatEntity } from './entities/userchat.entity';
import { MessageEntity } from './entities/message.entity';
import { UserModule } from '../user/user.module';
import { MessageGateway } from './gateways/message.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserChatEntity, MessageEntity])],
  controllers: [ChatController],
  providers: [JwtService, AuthService, ChatService, MessageGateway],
})
export class ChatModule {}

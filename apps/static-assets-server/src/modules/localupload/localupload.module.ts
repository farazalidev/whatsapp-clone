import { Module } from '@nestjs/common';
import { LocalUploadController } from './localupload.controller';
import { LocalUploadService } from './localupload.service';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity, UserChatEntity, MessageEntity])],
  controllers: [LocalUploadController],
  providers: [LocalUploadService],
})
export class LocalUploadModule {}

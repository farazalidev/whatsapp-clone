import { MessageEntity } from '../../modules/chat/entities/message.entity';
import { UserChatEntity } from '../../modules/chat/entities/userchat.entity';

export interface PubSubMessage {
  message: MessageEntity;
  receiver_pid: string;
  chat_id: string;
}

export interface MessageJSON {
  sender: string;
  receiver: string;
  message: MessageEntity;
  chat: UserChatEntity;
}

export interface unreadMessageJSON {
  chat_id: string;
  message: MessageEntity;
  receiver_id: string;
}

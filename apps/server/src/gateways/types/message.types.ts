import { MessageEntity } from '../../modules/chat/entities/message.entity';

export interface PubSubMessage {
  message: MessageEntity;
  receiver_pid: string;
  chat_id: string;
}

export interface MessageJSON {
  sender: string;
  receiver: string;
  message: MessageEntity;
  chat_id: string;
}

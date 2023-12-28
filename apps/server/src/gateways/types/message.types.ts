import { MessageEntity } from '../../modules/chat/entities/message.entity';

export interface PubSubMessage {
  message: MessageEntity;
  receiver_pid: string;
  chat_id: string;
}

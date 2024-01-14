import { MessageEntity } from '../../apps/server/src/modules/chat/entities/message.entity';

export interface messageStatus {
  is_seen: boolean;
  sended_at: Date;
  received_at: Date;
  seen_at: Date;
  sended: boolean;
}

export interface UpdateMessageStatusBulk {
  chat_id: string;
  messages: MessageEntity[];
}

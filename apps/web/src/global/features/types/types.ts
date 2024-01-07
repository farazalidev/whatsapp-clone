import { UserEntity } from '@server/modules/user/entities/user.entity';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { unreadMessage } from '@server/modules/types';

export interface ICombinedData {
  unread_messages: unreadMessage | undefined;
  id: string;
  chat_for: UserEntity;
  chat_with: UserEntity;
  messages: MessageEntity[];
}

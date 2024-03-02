import Dexie, { Table } from 'dexie';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

export class pendingDb extends Dexie {
  pendingChats: Table<UserChatEntity>;
  pendingMessages: Table<MessageEntity>;

  constructor() {
    super('pendingsDB');
    this.version(1).stores({
      pendingChats: 'id, chat_for, chat_with, messages',
      pendingMessages: 'id, content, sended_at, messageType, media, is_seen, received_at, seen_at, from, clear_for, sended,chat',
    });
  }
}

export const pendingsDb = new pendingDb();

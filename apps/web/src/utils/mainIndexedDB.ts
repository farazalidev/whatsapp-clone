'use client';
// db.ts
import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import Dexie, { Table } from 'dexie';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

export class MainDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  media!: Table<SelectedFileType>;
  mediaMessages: Table<MessageEntity>;

  constructor() {
    super('mainDb');
    this.version(1.4).stores({
      media: 'id, file, type, thumbnailUrl, url, attachedMessage, thumbnailPath,fileChecksum',
      mediaMessages: 'id, content, sended_at, messageType, media, is_seen, received_at, seen_at, from, clear_for, sended,chat',
    });
  }
}

export const mainDb = new MainDB();

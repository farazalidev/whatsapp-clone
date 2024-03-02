'use client';
// db.ts
import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import Dexie, { Table } from 'dexie';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { expectedFileTypes } from '../../../../../shared/types/mediaTypes';

export class MainDB extends Dexie {
  media: Table<SelectedFileType>;
  mediaMessages: Table<MessageEntity>;
  offlineMedia: Table<{ id: string; mime: string; type: expectedFileTypes; file: Blob }>;

  constructor() {
    super('mainDb');
    this.version(1.6).stores({
      media: 'id, file, type, thumbnailUrl, url, attachedMessage, thumbnailPath,fileChecksum,uploadedFileSize,mime',
      mediaMessages: 'id, content, sended_at, messageType, media, is_seen, received_at, seen_at, from, clear_for, sended,chat',
      offlineMedia: 'id, mime, type, file',
    });
  }
}

export const mainDb = new MainDB();

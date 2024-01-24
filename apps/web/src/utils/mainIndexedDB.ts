// db.ts
import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import Dexie, { Table } from 'dexie';

export class MainDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  media_messages!: Table<SelectedFileType>;

  constructor() {
    super('mainDb');
    this.version(1).stores({
      media_messages: 'id, file, type, thumbnailUrl, url, attachedMessage, thumbnailPath',
    });
  }
}

export const mainDb = new MainDB();

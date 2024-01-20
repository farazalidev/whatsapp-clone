import Dexie, { Table } from 'dexie';

interface IMediaStorageStore {
  user_id: string;
  file: File;
  chat_id: string;
}
class createMediaStorageDatabase extends Dexie {
  mediaStore: Table<IMediaStorageStore>;
  constructor() {
    super('media_db');
    this.version(1).stores({
      mediaStore: 'user_id,file,chat_id',
    });
  }
}

export const MediaDatabase = new createMediaStorageDatabase();

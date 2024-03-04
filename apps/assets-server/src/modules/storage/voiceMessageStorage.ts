import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { ExtendedReq } from 'src/guards/types';
import { storage } from './storage';
import * as fs from 'fs';

export const VoiceMessageStorage: MulterOptions = {
  storage: diskStorage({
    filename(req, file, callback) {
      callback(null, `${(req as ExtendedReq).headers.file_name}`);
    },
    destination(req, file, callback) {
      const path = `${storage.main}${(req as ExtendedReq).user.user_id}/voice-messages/`;
      const isPatchExisted = fs.existsSync(path);
      if (!isPatchExisted) fs.mkdirSync(path);
      callback(null, path);
    },
  }),
};

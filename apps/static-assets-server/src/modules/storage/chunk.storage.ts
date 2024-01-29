import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { storage } from './storage';
import * as fs from 'fs';
import { ExtendedReq } from 'src/guards/types';

export const chunkStorage: MulterOptions = {
  storage: diskStorage({
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${req.headers.chunk_number}`);
    },
    destination(req, file, callback) {
      const path = `${storage.main}/${(req as ExtendedReq).user.user_id}/attachments-chunks/${req.headers.file_id}`;
      const isPatchExisted = fs.existsSync(path);
      if (!isPatchExisted) fs.mkdirSync(path);
      callback(null, path);
    },
  }),
};

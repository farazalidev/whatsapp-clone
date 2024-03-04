import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { storage } from './storage';
import * as fs from 'fs';
import { ExtendedReq } from 'src/guards/types';

export const chunkStorage: MulterOptions = {
  storage: diskStorage({
    filename(req, file, callback) {
      callback(null, `${req.headers.sended_at}`);
    },
    destination(req, file, callback) {
      const path = `${storage.main}/${(req as ExtendedReq).user.user_id}/attachments-chunks/${req.headers.file_name}/`;
      const attachmentsChunksPath = `${storage.main}${(req as ExtendedReq).user.user_id}/attachments-chunks/`;
      const isAttachmentsFolderExisted = fs.existsSync(attachmentsChunksPath);
      if (!isAttachmentsFolderExisted) fs.mkdirSync(attachmentsChunksPath);
      const isPatchExisted = fs.existsSync(path);
      if (!isPatchExisted) fs.mkdirSync(path);
      callback(null, path);
    },
  }),
};

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { storage } from './storage';
import * as fs from 'fs';
import { ExtendedReq } from 'src/guards/types';

/**
 * In this storage we are going to store all the thumbnails of attachments
 * all the files will be saved as the name provided in the file_name header
 * with -header at last.
 */
export const AttachmentThumbnailStorage: MulterOptions = {
  storage: diskStorage({
    destination(req, file, callback) {
      const path = `${storage.main}${(req as ExtendedReq).user.user_id}/attachments/`;
      const isPath = fs.existsSync(path);
      if (!isPath) fs.mkdirSync(path);
      callback(null, path);
    },
    filename(req, file, callback) {
      callback(null, `${req.headers.file_name}-thumbnail-unp${req.headers.ext}`);
    },
  }),
};

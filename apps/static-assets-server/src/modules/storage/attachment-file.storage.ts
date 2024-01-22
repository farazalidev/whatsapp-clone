import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { WhiteListAttachmentFileMimeType } from './whitelistAttachmentFIleTypes';
import { HttpException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { storage } from './storage';
import { ExtendedReq } from 'src/guards/upload.guard';
import * as fs from 'fs';
import { extname } from 'path';
import { v4 } from 'uuid';

export const AttachmentFileStorage: MulterOptions = {
  fileFilter(req, file, callback) {
    if (!WhiteListAttachmentFileMimeType.includes(file.mimetype)) {
      return callback(new HttpException(`File ${file.mimetype} is not allowed`, 400), false);
    }
    callback(null, true);
  },

  limits: { fieldSize: 262144000 },
  storage: diskStorage({
    destination(req, file, callback) {
      const path = `${storage.main}${(req as ExtendedReq).user.user_id}/attachments/`;
      const isPatchExisted = fs.existsSync(path);
      if (!isPatchExisted) fs.mkdirSync(path);
      callback(null, path);
    },
    filename(req, file, callback) {
      callback(null, `${req.headers.file_name || v4()}${extname(file.originalname)}`);
    },
  }),
};

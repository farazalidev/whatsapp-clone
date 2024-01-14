import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 } from 'uuid';
import { WhiteListProfilePicMimeTypes } from './whitelistProfileImages';
import { HttpException } from '@nestjs/common';
import { storage } from './storage';

export const ProfilePicStorage: MulterOptions = {
  fileFilter(req, file, callback) {
    if (!WhiteListProfilePicMimeTypes.includes(file.mimetype)) {
      return callback(new HttpException(`File ${file.mimetype} is not allowed`, 400), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 5000000 },
  storage: diskStorage({
    destination: storage.profile_pic_storage,
    filename(req, file, callback) {
      const name = v4();
      callback(null, `${name}${extname(file.originalname)}`);
    },
  }),
};

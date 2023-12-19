import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { v4 } from 'uuid';
import * as path from 'path';
import * as FileType from 'file-type';
import * as fs from 'fs';

export type validFileExtension = 'png' | 'jpg' | 'jpeg';
export type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

export const validProfilePicExtension: validFileExtension[] = ['jpeg', 'jpg', 'png'];
export const validProfilePicMimeType: validMimeType[] = ['image/jpeg', 'image/jpg', 'image/png'];

export const saveProfilePicStorage: MulterOptions = {
  storage: diskStorage({
    destination: `apps/server/uploads/profile_pics/`,
    filename: (req, file, cb) => {
      const fileExt: string = path.extname(file.originalname);
      const fileName: string = v4() + fileExt;
      cb(null, fileName);
    },
  }),
  fileFilter(req, file, callback) {
    const allowedMimeType: validMimeType[] = validProfilePicMimeType;
    allowedMimeType.includes(file.mimetype as validMimeType) ? callback(null, true) : callback(null, false);
  },
};

export const isFileExtSafe = async (filePath: string): Promise<boolean> => {
  const file = await FileType.fromFile(filePath);
  if (validProfilePicExtension.includes(file?.ext as validFileExtension) && validProfilePicMimeType.includes(file?.mime as validMimeType)) {
    return true;
  }
  return false;
};

export const removeFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (error: any) {
    throw new Error(error);
  }
};

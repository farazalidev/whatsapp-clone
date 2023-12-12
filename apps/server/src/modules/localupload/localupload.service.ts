import { HttpStatus, Injectable } from '@nestjs/common';
import { isFileExtSafe, removeFile } from '../../utils/storage/profile_pic.storage';
import { ResponseType } from '../../Misc/ResponseType.type';

@Injectable()
export class LocalUploadService {
  async uploadProfilePic(file: Express.Multer.File): Promise<ResponseType> {
    if (!file?.filename) {
      return {
        success: false,
        error: { message: 'Image must be png, jpeg/jpg', statusCode: HttpStatus.BAD_REQUEST },
      };
    }

    const fullFilePath = `apps/server/uploads/profile_pics/${file.filename}`;

    // checking file mime type and extension
    const isSafeFile = await isFileExtSafe(fullFilePath);
    if (!isSafeFile) {
      removeFile(fullFilePath);
      return {
        success: false,
        error: { message: 'File content does not math extension', statusCode: HttpStatus.BAD_REQUEST },
      };
    }

    return {
      success: true,
      successMessage: 'uploaded',
      data: file,
    };
  }
}

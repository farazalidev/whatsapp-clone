import { Controller, HttpException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LocalUploadService } from './localupload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { saveProfilePicStorage } from 'src/utils/storage/profile_pic.storage';
import { Public } from '../auth/decorators/public.decorator';
import { isSuccess } from 'src/utils/isSuccess.typeguard';

@Controller('file')
export class LocalUploadController {
  constructor(private localUploadService: LocalUploadService) {}

  @Public()
  @Post('upload/profile-pic')
  @UseInterceptors(FileInterceptor('profile_pic', saveProfilePicStorage))
  async uploadUserProfilePic(@UploadedFile() file: Express.Multer.File): Promise<{ file_path: string }> {
    const response = await this.localUploadService.uploadProfilePic(file);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return { file_path: file.filename };
  }
}

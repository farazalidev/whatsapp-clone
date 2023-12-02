import { Body, Controller, Get, HttpException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { isSuccess } from 'src/utils/isSuccess.typeguard';
import { ResponseType } from 'src/Misc/ResponseType.type';
import { Public } from '../auth/decorators/public.decorator';
import { CloudinaryImageTypeResponse } from 'src/Misc/Image.type';
import { CloudinaryImageDto } from './DTO/cloudinaryImage.dto';
import { GetUser } from '../auth/decorators/getuser.decorator';
import { LoginPayload } from '../auth/auth.service';

@Controller('image')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  // upload profile pic
  @Public()
  @Post('upload/profile-pic')
  @UseInterceptors(FileInterceptor('profile_pic'))
  async uploadProfilePic(@UploadedFile() file): Promise<ResponseType<CloudinaryImageTypeResponse>> {
    const response = await this.uploadService.uploadProfilePic(file);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return {
      success: true,
      successMessage: 'Uploaded',
      data: { format: response.data.format, public_id: response.data.public_id },
    };
  }

  @Get('profileimage')
  async getImage(@GetUser() user: LoginPayload, @Body() body: CloudinaryImageDto): Promise<string> {
    const publicId = body.public_id;
    const response = await this.uploadService.getProfileImage(user.user_id, publicId);

    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data.url;
  }
}

// cloudinary.service.ts

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from 'src/Misc/ cloudinary-response';
import { ResponseType } from 'src/Misc/ResponseType.type';
import { createReadStream } from 'streamifier';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { getUrl } from 'src/utils/cloudinaryurl';

@Injectable()
export class UploadService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

  async uploadProfilePic(file): Promise<ResponseType<CloudinaryResponse>> {
    console.log('🚀 ~ file: upload.service.ts:12 ~ UploadService ~ uploadProfilePic ~ file:', file);
    try {
      const response = await new Promise<CloudinaryResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream;
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'whatsapp' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });

        createReadStream(file.buffer).pipe(uploadStream);
      });
      return {
        success: true,
        successMessage: 'Uploaded',
        data: response,
      };
    } catch (error) {
      console.log('🚀 ~ file: upload.service.ts:27 ~ UploadService ~ uploadProfilePic ~ error:', error);
      return {
        success: false,
        error: { message: 'Error while uploading profile image.', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }

  // get profile image
  async getProfileImage(user_id: string, public_id: string): Promise<ResponseType<{ url: string }>> {
    try {
      const profile_pic = await this.userRepo.findOne({ where: { user_id, profile: { profile_pic: { public_id } } } });
      return {
        success: true,
        successMessage: 'pic founded',
        data: { url: getUrl(profile_pic.profile.profile_pic.public_id, profile_pic.profile.profile_pic.format) },
      };
    } catch (error) {
      console.log('🚀 ~ file: upload.service.ts:53 ~ UploadService ~ getProfileImage ~ error:', error);
      return {
        success: false,
        error: { message: 'internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }
}

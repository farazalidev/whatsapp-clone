import { Injectable } from '@nestjs/common';
import { ProfilePicUploadResponseType } from './types/storageTypes';
import { ResponseType } from '@server/Misc/ResponseType.type';
import { readFileSync, existsSync } from 'fs';
import { storage } from '../storage/storage';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { profilePicSizes } from '../storage/sizes/profilePic.sizes';
import { isFileExtSafe } from 'src/utils/isFileExtSafe';
import { WhiteListProfilePicExtTypes, WhiteListProfilePicMimeTypes } from '../storage/whitelistProfileImages';

@Injectable()
export class LocalUploadService {
  async uploadProfilePic(file: Express.Multer.File, user_id: string): Promise<ResponseType<ProfilePicUploadResponseType>> {
    try {
      const destinationPath = `${storage.main}${user_id}/profile-pics/`;

      // Remove existing profile-pic directory if it exists
      const existingProfilePicPath = `${storage.main}${user_id}/profile-pics/`;
      if (existsSync(existingProfilePicPath)) {
        fs.rmSync(existingProfilePicPath, { recursive: true });
      }

      // Ensure the destination directory exists
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      const uploadedProfilePicPath = `${storage.profile_pic_storage}${file.filename}`;
      const uploadedProfilePic = readFileSync(uploadedProfilePicPath);
      const safe = await isFileExtSafe(uploadedProfilePicPath, WhiteListProfilePicExtTypes, WhiteListProfilePicMimeTypes);
      if (!safe) {
        fs.rmSync(uploadedProfilePicPath, { force: true, recursive: true });
        return {
          success: false,
          error: { message: 'File extension does not match file', statusCode: 400 },
        };
      }

      // Process each size configuration
      await Promise.all(
        profilePicSizes.map(async (sizeConfig) => {
          await sharp(uploadedProfilePic.buffer)
            .resize(sizeConfig.width, sizeConfig.height)
            .webp({ force: true })
            .toFile(`${destinationPath}${sizeConfig.suffix}.webp`);
        }),
      );

      fs.unlinkSync(`${storage.profile_pic_storage}${file.filename}`);

      return {
        success: true,
        successMessage: 'Successfully uploaded profile pic',
      };
    } catch (error) {
      console.log('🚀 ~ LocalUploadService ~ uploadProfilePic ~ error:', error);
      fs.unlinkSync(`${storage.profile_pic_storage}${file.filename}`);
      return {
        success: false,
        error: { message: 'Error while uploading profile pic', statusCode: 500 },
      };
    }
  }
}

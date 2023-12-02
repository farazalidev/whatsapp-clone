import { IsString, IsUrl } from 'class-validator';
import { CloudinaryImageEntity } from 'src/modules/upload/entities/cloudinaryimage.entity';

export class UserProfileDto {
  @IsUrl()
  profile_pic: CloudinaryImageEntity;

  @IsString()
  name: string;

  @IsString()
  about: string;
}

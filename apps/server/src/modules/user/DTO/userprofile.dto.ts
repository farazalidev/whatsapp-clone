import { IsObject, IsString } from 'class-validator';
import { CloudinaryImageEntity } from 'src/modules/upload/entities/cloudinaryimage.entity';

export class UserProfileDto {
  @IsObject({ message: 'Provide a valid object' })
  profile_pic: CloudinaryImageEntity;

  @IsString({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'About is required' })
  about: string;
}

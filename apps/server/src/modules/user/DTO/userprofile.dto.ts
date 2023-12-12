import { IsString } from 'class-validator';

export class UserProfileDto {
  @IsString({ message: 'Provide a valid object' })
  pic_path: string;

  @IsString({ message: 'About is required' })
  about: string;
}

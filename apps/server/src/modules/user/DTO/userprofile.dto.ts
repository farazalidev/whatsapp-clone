import { IsString } from 'class-validator';

export class UserProfileDto {
  @IsString({ message: 'Provide a valid object' })
  pic_path: string;

  @IsString({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'About is required' })
  about: string;
}

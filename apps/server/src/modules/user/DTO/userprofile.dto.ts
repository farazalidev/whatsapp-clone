import { IsString, IsUrl } from 'class-validator';

export class UserProfileDto {
  @IsUrl()
  profile_pic: string;

  @IsString()
  name: string;

  @IsString()
  about: string;
}

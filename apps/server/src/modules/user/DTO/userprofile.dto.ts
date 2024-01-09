import { IsString } from 'class-validator';

export class UserProfileDto {
  @IsString({ message: 'About is required' })
  about: string;
}

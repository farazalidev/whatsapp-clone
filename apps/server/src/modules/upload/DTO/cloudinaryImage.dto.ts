import { IsString } from 'class-validator';

export class CloudinaryImageDto {
  @IsString()
  public_id: string;

  @IsString()
  format: string;
}

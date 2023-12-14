import { IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  content: string;
}

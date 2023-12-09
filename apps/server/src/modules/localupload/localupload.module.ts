import { Module } from '@nestjs/common';
import { LocalUploadController } from './localupload.controller';
import { LocalUploadService } from './localupload.service';
import { UserModule } from '../user/user.module';

@Module({ imports: [UserModule], controllers: [LocalUploadController], providers: [LocalUploadService] })
export class LocalUploadModule {}

import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';

@Module({ controllers: [NotificationController], imports: [UserModule], exports: [], providers: [NotificationService] })
export class NotificationModule {}

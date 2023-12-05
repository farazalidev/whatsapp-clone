import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserProfileEntity } from './entities/userprofile.entity';
import { CloudinaryImageEntity } from '../upload/entities/cloudinaryimage.entity';
import { ChatRequestEntity } from './entities/chatRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity, CloudinaryImageEntity, ChatRequestEntity])],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule.forFeature([UserEntity, UserProfileEntity, CloudinaryImageEntity])],
})
export class UserModule {}

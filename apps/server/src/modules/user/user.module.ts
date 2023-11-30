import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserProfileEntity } from './entities/userprofile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity])],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

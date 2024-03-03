import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserProfileEntity } from './entities/userprofile.entity';
import { ContactEntity } from './entities/contact.entity';
import { SubscriptionEntity } from './entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity, ContactEntity, SubscriptionEntity])],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule.forFeature([UserEntity, UserProfileEntity, SubscriptionEntity])],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ContactEntity } from '../user/entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ContactEntity])],
  providers: [AuthService, UserService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}

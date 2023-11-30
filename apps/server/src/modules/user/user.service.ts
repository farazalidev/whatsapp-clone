import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { ResponseType } from 'src/Misc/ResponseType.type';
import { UserProfileDto } from './DTO/userprofile.dto';
import { UserProfileEntity } from './entities/userprofile.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>) {}

  // find user by email
  async findByEmail(email: string): Promise<ResponseType<UserEntity>> {
    const user = await this.UserRepo.findOne({ where: { email } });
    if (!user) {
      return {
        success: false,
        error: { message: 'User not Found', statusCode: HttpStatus.NOT_FOUND },
      };
    }
    return {
      success: true,
      data: user,
      successMessage: 'User Founded',
    };
  }

  // get user profile
  async getUserProfileService(user_id: string): Promise<ResponseType<UserEntity>> {
    const user = await this.UserRepo.findOne({ where: { user_id } });
    if (!user) {
      return {
        success: false,
        error: { message: 'user not found', statusCode: HttpStatus.NOT_FOUND },
      };
    }
    return {
      success: true,
      successMessage: 'user founded',
      data: user,
    };
  }

  // remove falseVerifiedUser
  async removeFalseVerifiedUsers() {
    const NowDate = parseInt((Date.now() / 1000).toFixed(0));
    await this.UserRepo.delete({ isVerified: false, registration_otp_exp: LessThan(NowDate) });
  }

  // complete user profile
  async completeUserProfileService(user_id: string, profile: UserProfileDto): Promise<ResponseType> {
    try {
      const user = await this.UserRepo.findOne({ where: { user_id } });
      if (!user) {
        return {
          success: false,
          error: { message: 'Registration was not successful', statusCode: HttpStatus.BAD_REQUEST },
        };
      }

      if (!user.profile) {
        // If user.profile is null, create a new UserProfileEntity
        const newProfile = new UserProfileEntity();
        newProfile.about = profile.about;
        newProfile.profile_pic = profile.profile_pic;

        user.profile = newProfile;
      } else {
        // If user.profile is not null, update its properties
        user.profile.about = profile.about;
        user.profile.profile_pic = profile.profile_pic;
      }

      user.name = profile.name;

      await this.UserRepo.save(user);
      return {
        success: true,
        successMessage: 'Profile saved',
      };
    } catch (error) {
      console.log('🚀 ~ file: user.service.ts:67 ~ UserService ~ completeUserProfileService ~ error:', error);
      return {
        success: false,
        error: { message: 'Error while saving profile', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }
}

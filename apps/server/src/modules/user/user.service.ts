import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { ResponseType } from 'src/Misc/ResponseType.type';
import { UserProfileEntity } from './entities/userprofile.entity';
import { ChatRequestEntity } from './entities/chatRequest.entity';
import { UserProfileDto } from './DTO/userprofile.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>) {}

  // find user by email
  async findByEmail(email: string): Promise<ResponseType<UserEntity>> {
    const user = await this.UserRepo.findOne({ where: { email }, relations: { chats_requests: true } });
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
  async getUserProfileService(user_id: string): Promise<ResponseType<UserProfileEntity>> {
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
      data: user.profile,
    };
  }
  // get user profile
  async getUser(user_id: string): Promise<ResponseType<UserEntity>> {
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

  // search user
  async searchUser(user_email: string): Promise<ResponseType<UserEntity>> {
    try {
      const user = await this.UserRepo.findOne({ where: { email: user_email, isVerified: true } });
      console.log('🚀 ~ file: user.service.ts:111 ~ UserService ~ searchUser ~ user:', user);
      if (!user) {
        return {
          success: false,
          error: { message: 'User Not Found', statusCode: HttpStatus.NOT_FOUND },
        };
      }

      return { success: true, successMessage: 'User Found', data: user };
    } catch (error) {
      return { success: false, error: { message: 'Internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR } };
    }
  }

  // send chat  request
  async sendChatRequestService(requester_id: string, acceptor_email: string): Promise<ResponseType> {
    try {
      const Requester = await this.UserRepo.findOne({ where: { user_id: requester_id } });

      if (!Requester) {
        return {
          success: false,
          error: { message: 'Unable to send request.', statusCode: HttpStatus.BAD_REQUEST },
        };
      }

      const Acceptor = await this.UserRepo.findOne({ where: { email: acceptor_email } });

      if (!Acceptor) {
        return {
          success: false,
          error: { message: 'Unable to send request.', statusCode: HttpStatus.BAD_REQUEST },
        };
      }

      // sending chat request
      const newChatRequest = new ChatRequestEntity();
      newChatRequest.acceptor = Acceptor;
      newChatRequest.requester_id = Requester;
      newChatRequest.status = 'pending';
      Acceptor.chats_requests = [...Acceptor.chats_requests, newChatRequest];

      await this.UserRepo.save(Acceptor);
      return {
        success: true,
        successMessage: 'Request sended',
        data: newChatRequest,
      };
    } catch (error) {
      console.log('🚀 ~ file: user.service.ts:153 ~ UserService ~ sendChatRequestService ~ error:', error);
      return {
        success: false,
        error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }

  async completeProfile(user_id: string, profile: UserProfileDto): Promise<ResponseType> {
    try {
      const user = await this.UserRepo.findOne({ where: { user_id } });
      const newProfile = new UserProfileEntity();
      newProfile.about = profile.about;
      newProfile.pic_path = profile.pic_path;
      user.name = profile.name;
      user.profile = newProfile;

      await this.UserRepo.save(user);
      return {
        success: true,
        successMessage: 'uploaded',
      };
    } catch (error) {
      console.log('🚀 ~ file: user.service.ts:145 ~ UserService ~ completeProfile ~ error:', error);
      return {
        success: false,
        error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }
}

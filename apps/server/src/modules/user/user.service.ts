import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { UserProfileEntity } from './entities/userprofile.entity';
import { UserProfileDto } from './DTO/userprofile.dto';
import { ContactEntity } from './entities/contact.entity';
import { ResponseType } from '../../Misc/ResponseType.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
    @InjectRepository(ContactEntity) private ContactRepo: Repository<ContactEntity>,
  ) {}

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
  // get user
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

  async completeProfile(user_id: string, profile: UserProfileDto): Promise<ResponseType> {
    try {
      const user = await this.UserRepo.findOne({ where: { user_id } });
      const newProfile = new UserProfileEntity();
      newProfile.about = profile.about;
      newProfile.pic_path = profile.pic_path;
      user.profile = newProfile;

      await this.UserRepo.save(user);
      return {
        success: true,
        successMessage: 'uploaded',
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }

  async addNewContact(user_id: string, requested_email: string): Promise<ResponseType> {
    try {
      const user = await this.UserRepo.findOne({ where: { user_id, isVerified: true } });

      if (!user) {
        return {
          success: false,
          error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
        };
      }

      const contactForUser = await this.UserRepo.findOne({ where: { email: requested_email } });

      const newContact = new ContactEntity();
      newContact.contact_user = contactForUser;
      newContact._user = user;

      user.addNewContact(newContact);

      await this.UserRepo.save(user);
      return {
        success: true,
        successMessage: 'Contact added',
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to add new Contact', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }

  // get user contacts
  async getUserContacts(user_id: string): Promise<ResponseType<ContactEntity[]>> {
    try {
      const contacts = await this.ContactRepo.find({ where: { _user: { user_id } } });
      return {
        success: true,
        successMessage: 'Contacts loaded',
        data: contacts,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }
}

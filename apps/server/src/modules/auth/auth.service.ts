import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './DTO/login.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../user/DTO/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthTokens, OtpToken, OtpTokenPayload } from '../types';
import { ResponseType } from '../../Misc/ResponseType.type';
import { generateOtp } from '../../utils/generateOtp';
import { isSuccess } from '../../utils/isSuccess.typeguard';
import { getTokens } from '../../utils/getTokens';

export type LoginResponse = {
  user: UserEntity;
  tokens: { access: string; refresh: string };
};
export type LoginPayload = {
  user_id: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
  ) {}

  private async getOptToken(user_id: string, method: 'login' | 'registration'): Promise<OtpToken> {
    const otp_token = await this.jwtService.signAsync({ user_id, method }, { expiresIn: '5m', secret: process.env.OTP_TOKEN_SECRET });
    return { otp_token };
  }

  // update refresh token hash in users db
  public async updateRefreshTokenHash(user_id: string, refresh_token: string) {
    const user = await this.UserRepo.findOne({ where: { user_id } });
    const hashedRefreshToken = await hash(refresh_token, 10);
    user.refresh_hash = hashedRefreshToken;
    await this.UserRepo.save(user);
  }

  public async otpToBeVerified(user_id: string) {
    const user = await this.UserRepo.findOne({ where: { user_id, registration_otp_exp: MoreThan(Date.now()) } });
    if (user?.user_id) {
      return true;
    }
    return false;
  }

  public otp(email: string) {
    const NowTime = parseInt((Date.now() + 300000).toFixed(0));
    const registration_otp = generateOtp();
    const updateOtp = async (): Promise<boolean> => {
      try {
        await this.UserRepo.update({ email }, { registration_otp, registration_otp_exp: NowTime });
        return true;
      } catch (error) {
        false;
      }
    };
    const getOtp = () => {
      return { registration_otp, registration_otp_exp: NowTime };
    };

    return { updateOtp, getOtp };
  }

  /**
   *
   * @param user getting user details like RegisterUserDto
   * @returns ResponseType
   */
  async RegisterUser(user: RegisterUserDto): Promise<ResponseType<OtpToken>> {
    try {
      // Finding the user existence
      const isExistedUser = await this.UserRepo.findOne({
        where: { email: user.email },
      });

      /**
       * if the user exists already then sends error of conflict
       */
      if (isExistedUser) {
        return {
          success: false,
          error: {
            message: 'User already Registered',
            statusCode: HttpStatus.CONFLICT,
          },
        };
      }

      const otp = this.otp(user.email).getOtp();

      const newUser = this.UserRepo.create({
        ...user,
        registration_otp: otp.registration_otp,
        registration_otp_exp: otp.registration_otp_exp,
      });

      // saving the user
      const saved_user = await this.UserRepo.save(newUser);

      // getting otp token
      const otp_token = await this.getOptToken(saved_user.user_id, 'registration');

      return { success: true, successMessage: 'Registration Successful', data: otp_token };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      };
    }
  }

  async verifyOtp(otp: string, otpPayload: OtpTokenPayload): Promise<ResponseType<AuthTokens>> {
    const NowDate = parseInt(Date.now().toFixed(0));

    try {
      const user = await this.UserRepo.findOne({
        where: {
          user_id: otpPayload.user_id,
          registration_otp: otp,
          registration_otp_exp: MoreThan(NowDate),
          isVerified: otpPayload.method === 'login' ? true : false,
        },
      });

      if (!user?.user_id) {
        return {
          success: false,
          error: {
            message: 'Otp is invalid or Expired',
            statusCode: HttpStatus.NOT_FOUND,
          },
        };
      }

      if (user.user_id === otpPayload.user_id) {
        // getting token
        const tokens = await getTokens(user.user_id, this.jwtService);

        // removing otp from user table
        user.registration_otp = null;
        user.registration_otp_exp = null;
        if (otpPayload.method === 'registration') {
          user.isVerified = true;
        }

        // saving user
        await this.UserRepo.save(user);

        await this.updateRefreshTokenHash(user.user_id, tokens.refresh_token);

        return {
          success: true,
          successMessage: 'Verification successful',
          data: tokens,
        };
      }
      return {
        success: false,
        error: { message: 'internal server error', statusCode: 500 },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to verify',
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }
  }

  /**
   *
   * @param user Getting user like LoginDto
   * @returns ResponseType<LoginResponse>
   */
  async LoginService(user: LoginDto): Promise<ResponseType<OtpToken>> {
    try {
      // first we will check if the user already registered or not
      // if the user was not registered then we will create his account
      // and then login it
      // else we will login it

      const response = await this.userService.findByEmail(user.email);

      if (!isSuccess(response)) {
        return { success: false, error: { message: 'Internal server error', statusCode: 500 } };
      }

      if (isSuccess(response)) {
        // before generating otp tokens we will check if there is already an otp to be verified

        const otpToBeVerified = await this.otpToBeVerified(response.data.user_id);

        if (otpToBeVerified) {
          return {
            success: false,
            error: { message: 'otp verification is pending', statusCode: 400 },
          };
        }

        // generating otp tokens
        const tokens = await this.getOptToken(response.data?.user_id, 'login');
        const isOtpUpdated = await this.otp(response.data.email).updateOtp();
        if (!isOtpUpdated) {
          return {
            success: false,
            error: { message: 'failed to update the otp', statusCode: 500 },
          };
        }

        return { success: true, successMessage: 'user founded', data: tokens };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      };
    }
  }

  /**
   *
   * @param user_id requires user's id to resign refresh token
   * @returns ResponseType<AuthTokens>
   */
  async refreshTokenService(user_id: string, refresh_token: string): Promise<ResponseType<AuthTokens>> {
    try {
      const user = await this.userService.getUser(user_id);

      if (!isSuccess(user)) {
        return {
          success: false,
          error: {
            message: 'user not found',
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        };
      }

      // checking refresh token hash
      const isValidRefreshToken = await bcrypt.compare(refresh_token, user.data.refresh_hash);

      if (!isValidRefreshToken) {
        return {
          success: false,
          error: { message: 'Unauthorized', statusCode: 401 },
        };
      }

      // getting new tokens
      const tokens = await getTokens(user.data.user_id, this.jwtService);

      // updating refresh token hash
      await this.updateRefreshTokenHash(user.data.user_id, tokens.refresh_token);

      return {
        success: true,
        successMessage: 'Refresh Success',
        data: tokens,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      };
    }
  }

  /**
   *
   * @param user_id user to logout
   */
  async logout(user_id: string): Promise<ResponseType> {
    try {
      const user = await this.UserRepo.findOne({
        where: { user_id, refresh_hash: Not('') },
      });
      if (!user) {
        return {
          success: false,
          error: {
            message: 'Logout failed',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
        };
      }

      // if the user founded
      user.refresh_hash = null;
      await this.UserRepo.save(user);

      return {
        success: true,
        successMessage: 'Logout successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      };
    }
  }

  async getUserEmailByUserId(user_id: string): Promise<ResponseType<{ email: string }>> {
    try {
      const user = await this.UserRepo.findOne({ where: { user_id } });
      return { success: true, data: { email: user.email }, successMessage: 'success' };
    } catch (error) {
      return { success: false, error: { message: 'internal server error', statusCode: 500 } };
    }
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './DTO/login.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../user/DTO/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthTokens, OtpToken } from '../types';
import { ResponseType } from '../../Misc/ResponseType.type';
import { generateOtp } from '../../utils/generateOtp';
import { isSuccess } from '../../utils/isSuccess.typeguard';

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

  // get tokens function
  private async getTokens(user_id: string): Promise<AuthTokens> {
    const refresh_token = await this.jwtService.signAsync({ user_id }, { expiresIn: '7d', secret: process.env.REFRESH_TOKEN_SECRET });
    const access_token = await this.jwtService.signAsync({ user_id }, { expiresIn: '5m', secret: process.env.ACCESS_TOKEN_SECRET });
    return { access_token, refresh_token };
  }

  private async getOptToken(user_id: string): Promise<OtpToken> {
    const otp_token = await this.jwtService.signAsync({ user_id }, { expiresIn: '5m', secret: process.env.OTP_TOKEN_SECRET });
    return { otp_token };
  }

  private async validateUserName(user_name: string): Promise<boolean> {
    const username = await this.UserRepo.findOne({
      where: { username: user_name },
    });
    if (username) return false;
    return true;
  }

  // update refresh token hash in users db
  private async updateRefreshTokenHash(user_id: string, refresh_token: string) {
    const user = await this.UserRepo.findOne({ where: { user_id } });
    const hashedRefreshToken = await hash(refresh_token, 10);
    user.refresh_hash = hashedRefreshToken;
    await this.UserRepo.save(user);
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

      // validating username
      const isValidUserName = await this.validateUserName(user.username);
      if (!isValidUserName) {
        return {
          success: false,
          error: {
            message: 'Username already exists',
            statusCode: HttpStatus.CONFLICT,
          },
        };
      }

      // hashing password
      const hashed_password = await hash(user.password, 10);

      const NowTime = parseInt((Date.now() / 1000 + 300).toFixed(0));

      const newUser = this.UserRepo.create({
        ...user,
        registration_otp: generateOtp(),
        registration_otp_exp: NowTime,
        password: hashed_password,
      });

      // saving the user
      const saved_user = await this.UserRepo.save(newUser);

      // getting otp token
      const otp_token = await this.getOptToken(saved_user.user_id);
      return {
        success: true,
        successMessage: 'Registration Successful',
        data: otp_token,
      };
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

  async verifyOtp(otp: string, user_id: string): Promise<ResponseType<AuthTokens>> {
    const NowDate = parseInt((Date.now() / 1000).toFixed(0));
    try {
      const user = await this.UserRepo.findOne({
        where: {
          user_id,
          registration_otp: otp,
          registration_otp_exp: MoreThan(NowDate),
          isVerified: false,
        },
      });

      if (!user) {
        return {
          success: false,
          error: {
            message: 'Otp is invalid or Expired',
            statusCode: HttpStatus.NOT_FOUND,
          },
        };
      }

      // getting token
      const tokens = await this.getTokens(user.user_id);

      // removing otp from user table
      user.registration_otp = null;
      user.registration_otp_exp = null;
      user.isVerified = true;

      // saving user
      await this.UserRepo.save(user);

      await this.updateRefreshTokenHash(user.user_id, tokens.refresh_token);

      return {
        success: true,
        successMessage: 'Verification successful',
        data: tokens,
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
  async LoginService(user: LoginDto): Promise<ResponseType<AuthTokens>> {
    try {
      const response = await this.userService.findByEmail(user.email);
      if (!isSuccess(response)) {
        return {
          success: false,
          error: {
            message: 'username or password is wrong',
            statusCode: HttpStatus.NOT_FOUND,
          },
        };
      }

      if (isSuccess(response)) {
        // matching password
        const isValidPassword = await compare(user.password, response.data.password);

        if (!isValidPassword) {
          return {
            success: false,
            error: {
              message: 'username or password is wrong',
              statusCode: HttpStatus.BAD_REQUEST,
            },
          };
        }

        // generating access and refresh tokens
        const tokens = await this.getTokens(response.data.user_id);

        // updating refresh hash
        await this.updateRefreshTokenHash(response.data.user_id, tokens.refresh_token);

        return {
          success: true,
          successMessage: 'Login success',
          data: tokens,
        };
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
      const tokens = await this.getTokens(user.data.user_id);

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
}

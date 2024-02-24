import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './DTO/login.dto';
import { AuthService, LoginPayload } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/getuser.decorator';
import { RefreshGuard } from './guards/refreshToken.guard';
import { GetRefreshData } from './decorators/getrefreshData.decorator';
import { sendCookies, sendOtpCookies } from './sendCookies';
import { otpGuard } from './guards/otp.guard';
import { Response } from 'express';
import { isSuccess } from '../../utils/isSuccess.typeguard';
import { extractNameFromEmail } from '../../utils/extractNameFromEmail';
import { GetOtpPayload } from './decorators/getOtpPayload';
import { OtpTokenPayload } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  @Public()
  @Post('verify-user')
  @UseGuards(otpGuard)
  async verifyOtp(@Body() body, @GetOtpPayload() otp: OtpTokenPayload, @Res() res: Response) {
    const response = await this.authService.verifyOtp(body.registration_otp, otp);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    res.clearCookie(process.env.OTP_TOKEN_NAME, { expires: new Date(0) });
    return sendCookies(res, response.data, response);
  }

  //   Login User
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(@Body() user: LoginDto, @Res() res) {
    const isUserExisted = await this.userService.findByEmail(user.email);

    //  if the user not existed then register the user
    if (!isSuccess(isUserExisted)) {
      const registrationResponse = await this.authService.RegisterUser({ email: user.email, name: extractNameFromEmail(user.email) });
      if (!isSuccess(registrationResponse)) {
        throw new HttpException(registrationResponse.error.message, registrationResponse.error.statusCode);
      }
      return sendOtpCookies(res, registrationResponse.data, registrationResponse);
    }

    const response = await this.authService.LoginService(user);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return sendOtpCookies(res, response?.data, response);
  }

  // refresh token
  @UseGuards(RefreshGuard)
  @Public()
  @Get('refresh')
  async refresh(@GetRefreshData() refreshData, @Res() res) {
    const response = await this.authService.refreshTokenService(refreshData.refresh_user.user_id, refreshData.refresh);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return sendCookies(res, response.data, response);
  }

  // logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: LoginPayload) {
    const response = await this.authService.logout(user.user_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response;
  }

  @Public()
  @Get('user-email')
  @UseGuards(otpGuard)
  async getUserEmailByUserId(@GetOtpPayload() otpPayload: OtpTokenPayload) {
    const response = await this.authService.getUserEmailByUserId(otpPayload.user_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response.data;
  }

  @Get('skip-profile')
  async skipProfile(@GetUser() user: LoginPayload) {
    try {
      await this.userRepo.update({ user_id: user.user_id }, { is_profile_completed: true });
      return true;
    } catch (error) {
      return false;
    }
  }
}

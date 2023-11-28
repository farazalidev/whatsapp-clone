import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from '../user/DTO/user.dto';
import { LoginDto } from './DTO/login.dto';
import { AuthService, LoginPayload } from './auth.service';
import { isSuccess } from 'src/utils/isSuccess.typeguard';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/getuser.decorator';
import { RefreshGuard } from './guards/refreshToken.guard';
import { GetRefreshData } from './decorators/getrefreshData.decorator';
import { sendCookies, sendOtpCookies } from './sendCookies';
import { otpGuard } from './guards/otp.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  //   Register User
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async RegisterUser(@Body() user: RegisterUserDto, @Res() res) {
    const response = await this.authService.RegisterUser(user);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }

    return sendOtpCookies(res, response.data, response);
  }

  @Public()
  @Post('verify-user')
  @UseGuards(otpGuard)
  async verifyOtp(@Body() body, @GetUser() user: LoginPayload, @Res() res: Response) {
    const response = await this.authService.verifyOtp(body.registration_otp, user.user_id);
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
    const response = await this.authService.LoginService(user);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return sendCookies(res, response.data, response);
  }

  // refresh token
  @UseGuards(RefreshGuard)
  @Public()
  @Post('refresh')
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
}

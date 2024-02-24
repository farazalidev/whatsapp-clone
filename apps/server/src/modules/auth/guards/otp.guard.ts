import { CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { OtpTokenPayload } from '../../types';

@Injectable()
export class otpGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const otp_token = await req.cookies[process.env.OTP_TOKEN_NAME];

    if (!otp_token) {
      throw new ForbiddenException();
    }

    try {
      const payload: OtpTokenPayload = await this.jwt.verifyAsync(otp_token, { secret: process.env.OTP_TOKEN_SECRET });
      req['otp'] = payload;
      return true;
    } catch (error) {
      throw new HttpException('Otp expired or Invalid', HttpStatus.BAD_REQUEST);
    }
  }
}

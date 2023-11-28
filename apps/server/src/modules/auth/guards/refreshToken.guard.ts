import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from '../auth.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const refreshToken = await req.cookies?.[process.env.REFRESH_TOKEN_NAME];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    // getting user from refresh token
    const payload: LoginPayload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });

    req['refresh'] = refreshToken;
    req['refresh_user'] = payload;
    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from '../auth.service';
import { decryptCookie } from '../../../utils/encdecCookie';

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
    const decryptedRefreshToken = decryptCookie(refreshToken);
    const payload: LoginPayload = await this.jwt.verifyAsync(decryptedRefreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });

    req['refresh'] = refreshToken;
    req['refresh_user'] = payload;
    return true;
  }
}

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { decryptCookie } from '../../../utils/encdecCookie';
import { getCookieValue } from '../../../utils/getCookieFromHeader';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private reflector: Reflector,
    @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest<Request>();

    const accessTokenFromHeaders = getCookieValue(req.headers.cookie, process.env.ACCESS_TOKEN_NAME);
    const accessToken = req.headers['authorization']?.split(' ')[1] || accessTokenFromHeaders;
    const refreshToken = getCookieValue(req.headers.cookie, process.env.REFRESH_TOKEN_NAME);

    if (!accessToken) {
      if (!refreshToken) throw new UnauthorizedException();
      throw new ForbiddenException();
    }
    try {
      const decryptedAccessToken = decryptCookie(accessToken);
      const payload: LoginPayload = await this.jwt.verifyAsync(decryptedAccessToken, { secret: process.env.ACCESS_TOKEN_SECRET });
      const user = await this.UserRepo.findOne({ where: { user_id: payload.user_id } });
      req['user'] = user;
      return true;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { LoginPayload } from '@server/modules/auth/auth.service';
import { ExtendedReq } from './types';
import { getCookieValue } from 'src/utils/getCookieFromHeader';

@Injectable()
export class Upload_Guard implements CanActivate {
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
    const req = context.switchToHttp().getRequest<ExtendedReq>();
    const accessTokenFromHeaders = getCookieValue(req.headers.cookie, process.env.ACCESS_TOKEN_NAME);
    const accessToken = req.headers['authorization']?.split(' ')[1] || accessTokenFromHeaders;
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const payload: LoginPayload = await this.jwt.verifyAsync(accessToken, { secret: process.env.ACCESS_TOKEN_SECRET });
      const user = await this.UserRepo.findOne({ where: { user_id: payload.user_id } });
      req['user'] = user;
      return true;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}

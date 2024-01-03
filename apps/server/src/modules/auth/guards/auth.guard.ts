import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';

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

    const accessToken = req.headers['authorization']?.split(' ')[1];
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

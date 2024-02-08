import { Socket } from 'socket.io';
import { WsIoException } from '../../../utils/WsIoException';
import { isValidToken } from '../../../utils/isValidToken';
import { LoginPayload } from '../auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { decryptCookie } from '../../../utils/encdecCookie';

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const WsAuthMiddleware = (userRepo: Repository<UserEntity>): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const accessToken = (await socket.handshake.auth.accessToken) || socket.handshake.headers.auth;

      if (!accessToken) {
        return next(new WsIoException('Unauthorized', 401));
      }

      const decryptedAccessToken = decryptCookie(accessToken);

      const isValidAccessToken = await isValidToken<LoginPayload>(decryptedAccessToken, process.env.ACCESS_TOKEN_SECRET);

      if (!isValidAccessToken.success) {
        return next(new WsIoException('Forbidden', 403));
      }

      const user = await userRepo.findOne({ where: { user_id: isValidAccessToken.payload.user_id } });

      socket['user'] = user;
      return next();
    } catch (error) {
      return next(new WsIoException('Internal Server Error', 500));
    }
  };
};

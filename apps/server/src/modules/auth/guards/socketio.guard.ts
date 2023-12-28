import { Socket } from 'socket.io';
import { WsIoException } from '../../../utils/WsIoException';
import { isValidToken } from '../../../utils/isValidToken';
import { LoginPayload } from '../auth.service';

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const WsAuthMiddleware = (): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const accessToken = (await socket.handshake.auth.accessToken) || socket.handshake.headers.auth;

      if (!accessToken) {
        return next(new WsIoException('Unauthorized', 401));
      }

      const isValidAccessToken = await isValidToken<LoginPayload>(accessToken, process.env.ACCESS_TOKEN_SECRET);

      if (!isValidAccessToken.success) {
        return next(new WsIoException('Forbidden', 403));
      }

      socket['user'] = isValidAccessToken.payload;
      return next();
    } catch (error) {
      return next(new WsIoException('Internal Server Error', 500));
    }
  };
};

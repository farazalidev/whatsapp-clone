import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ISocket } from '@shared/types';
import { OnlineUsersService } from '../services/onlineUsers.service';
import { WsIoException } from '../utils/WsIoException';
import { onEvent } from '../utils/onEvent';
import { Server } from 'socket.io';
import { WsAuthMiddleware } from '../modules/auth/guards/socketio.guard';

@WebSocketGateway({ cors: { origin: process.env.FRONT_END_URL, credentials: true } })
export class UserGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  constructor(private onlineUsersService: OnlineUsersService) {}
  afterInit(server: Server) {
    server.use(WsAuthMiddleware());
  }
  handleConnection(client: ISocket) {
    client.emit('get_pid', process.env.PID);
  }
  handleDisconnect(client: ISocket) {
    this.onlineUsersService.removeUser(client.user.user_id, (err, removed) => {
      if (err) {
        throw new WsIoException('Error', 500);
      }
      if (removed) {
        console.log('removed');
      }
    });
  }

  @WebSocketServer()
  server: ISocket;

  @onEvent('make_user_online')
  async handleUserConnection(client: ISocket) {
    await this.onlineUsersService.addUserToRedis(client.user.user_id, process.env.PID);
    client.emit('get_pid', process.env.PID);
  }
}

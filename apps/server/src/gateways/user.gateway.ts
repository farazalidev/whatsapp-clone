import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ISocket } from '@shared/types';
import { OnlineUsersService } from '../services/onlineUsers.service';
import { WsIoException } from '../utils/WsIoException';
import { onEvent } from '../utils/onEvent';
import { Server } from 'socket.io';
import { WsAuthMiddleware } from '../modules/auth/guards/socketio.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({ cors: { origin: process.env.FRONT_END_URL, credentials: true } })
export class UserGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  constructor(
    private onlineUsersService: OnlineUsersService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  afterInit(server: Server) {
    server.use(WsAuthMiddleware(this.userRepo));
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

import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ISocket, getUserOnlineStatusPayload } from '@shared/types';
import { OnlineUsersService } from '../services/onlineUsers.service';
import { WsIoException } from '../utils/WsIoException';
import { Server } from 'socket.io';
import { WsAuthMiddleware } from '../modules/auth/guards/socketio.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { onEvent } from '../utils/onEvent';
import { RoomService } from '../services/room.service';
import { ChatService } from '../modules/chat/chat.service';

@WebSocketGateway({ cors: { origin: process.env.FRONT_END_URL, credentials: true } })
export class UserGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  constructor(
    private onlineUsersService: OnlineUsersService,
    private roomService: RoomService,
    private chatService: ChatService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  afterInit(server: Server) {
    server.use(WsAuthMiddleware(this.userRepo));
  }
  async handleConnection(client: ISocket) {
    client.emit('get_pid', process.env.PID);
    client.join(client.user.user_id);
    if (client?.user) {
      this.server.emit(`status_user_${client.user.user_id}`, true);
      await this.chatService.updateMessagesStatusToReceived(client.user.user_id);
    }
  }

  async handleDisconnect(client: ISocket) {
    await this.onlineUsersService.removeUser(client.user.user_id, (err, removed) => {
      if (err) {
        console.log('🚀 ~ UserGateway ~ awaitthis.onlineUsersService.removeUser ~ err:', err);
        throw new WsIoException('Error', 500);
      }
      if (removed) {
        console.log('🚀 ~ UserGateway ~ awaitthis.onlineUsersService.removeUser ~ removed:', removed);
        console.log('user removed from online users list');
      }
    });

    await this.roomService.removeAllUserRooms(client.user.user_id);

    // updating user online status
    this.server.emit(`status_user_${client.user.user_id}`, false);
  }

  @onEvent('get_user_online_status')
  async getUserOnlineStatus(client: ISocket, payload: getUserOnlineStatusPayload) {
    // TODO: before sending some user online status, check the user and the finder relation
    let user_pid;
    await this.onlineUsersService.getUserPid(payload.user_id, (err, pid) => {
      if (err) {
        return;
      }
      user_pid = pid;
    });
    // if the user is online then send true status

    if (user_pid) {
      this.server.emit(`status_user_${payload.user_id}`, true);
      return;
    }
    // if not then send the false status
    this.server.emit(`status_user_${payload.user_id}`, false);
  }

  @WebSocketServer()
  server: ISocket;
}

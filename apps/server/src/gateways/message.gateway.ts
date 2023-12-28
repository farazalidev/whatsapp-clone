import { WebSocketGateway, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { MessageEntity } from '../modules/chat/entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { ISocket, RemoveUserFromRoomPayload, leaveRoomPayload } from '@shared/types';
import { onEvent } from '../utils/onEvent';
import { pubsubService } from '../services/pubsub.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { RoomService } from '../services/room.service';
import { OnlineUsersService } from '../services/onlineUsers.service';
import { WsIoException } from '../utils/WsIoException';
import { Server } from 'socket.io';
import { WsAuthMiddleware } from '../modules/auth/guards/socketio.guard';

// Define a helper function to extract event names

@WebSocketGateway({ cors: { credentials: true, origin: [process.env.FRONT_END_URL] } })
export class MessageGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  constructor(
    private jwt: JwtService,
    @InjectRedis() private redis: Redis,
    private pubsub: pubsubService,
    private roomService: RoomService,
    private onlineUsersService: OnlineUsersService,
  ) {}
  afterInit(server: Server) {
    server.use(WsAuthMiddleware());
  }
  handleConnection(client: ISocket) {
    console.log(client.user.user_id);
  }

  handleDisconnect() {
    // const user_id = client['user'].user_id;
  }

  @WebSocketServer()
  server: ISocket;

  @onEvent('join_room')
  async joinRoom(client: ISocket, payload: { chat_id: string }) {
    await this.roomService.joinOrCreateRoom(payload.chat_id, client.user.user_id, process.env.PID);

    client.join(payload.chat_id);
  }

  @onEvent('init_room')
  async InitRoom(client: ISocket) {
    console.log(client.user.user_id);
  }

  @onEvent('send_message')
  async sendMessage(client: ISocket, payload: { message: MessageEntity; chat_id: string; receiverId: string }) {
    const isUserInTheRoom = await this.roomService.isUserInTheRoom(payload.chat_id, payload.receiverId);

    let receiver_pid;
    await this.onlineUsersService.getUserPid(payload.receiverId, async (err, pid) => {
      if (err) {
        throw new WsIoException('Error while sending message', 500);
      }

      receiver_pid = pid;
    });

    if (!isUserInTheRoom) {
      if (!receiver_pid) {
        // if the user is not online at all
        // sends push notification
        // TODO: Send a push notification
      }
      // if the user is not in the room then sends message notification
      // TODO: Send a message notification

      return;
    }
    client.to(payload.chat_id).emit('newMessage', payload.message);
    this.server.emit(`user_${client.user.user_id}`, payload.message);
  }

  @onEvent('leave_room')
  async leaveRoom(client: ISocket, payload: leaveRoomPayload) {
    client.leave(payload.room_id);
    console.log(`user leaves room ${payload.room_id} user ${client.user.user_id}`);

    await this.roomService.removeUserFromRoom(payload.room_id, client.user.user_id);
  }

  @onEvent('remove_user_from_room')
  async removeUserFromRoom(client: ISocket, payload: RemoveUserFromRoomPayload) {
    await this.roomService.removeUserFromRoom(payload.chat_id, client.user.user_id);
  }
}

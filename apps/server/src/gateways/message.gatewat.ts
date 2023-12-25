import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageEntity } from '../modules/chat/entities/message.entity';
import { WsAuthMiddleware } from '../modules/auth/guards/socketio.guard';
import { JwtService } from '@nestjs/jwt';
import { ClientToServerEvents, ServerToClientEvents, leaveRoomPayload } from '@shared/types';
import { onEvent } from '../utils/onEvent';

interface ISocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  user: { user_id: string };
}
// Define a helper function to extract event names

@WebSocketGateway({ cors: { credentials: true, origin: [process.env.FRONT_END_URL] } })
export class MessageGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(private jwt: JwtService) {}

  online_users: { user_id: string }[] = [];

  handleDisconnect() {
    // const user_id = client['user'].user_id;
  }

  afterInit(server: Server) {
    server.use(WsAuthMiddleware(this.jwt));
  }

  @WebSocketServer()
  server: ISocket;

  @onEvent('join_room')
  async joinRoom(client: ISocket, payload: { chat_id: string }) {
    const isOnline = this.online_users.some((user) => user.user_id === client.user.user_id);
    if (!isOnline) {
      this.online_users.push({ user_id: client?.user.user_id });
    }
    client.emit('users', this.online_users);

    client.join(payload.chat_id);
  }

  @onEvent('send_message')
  async sendMessage(client: ISocket, payload: { message: MessageEntity; chat_id: string; receiverId: string }) {
    const isUserOnline = this.online_users.some((user) => user.user_id === payload.receiverId);
    if (isUserOnline) {
      console.log('user is online');

      client.to(payload.chat_id).emit('newMessage', payload.message);
      return;
    }
    // TODO:send notification to offline user
    // emitting this event only to the sender
    console.log('sending notification');

    this.server.emit(`user_${client.user.user_id}`, payload.message);
  }

  @onEvent('get_online_users')
  async getOnlineUsers() {
    this.server.emit('users', this.online_users);
  }

  @onEvent('leave_room')
  async leaveRoom(client: ISocket, payload: leaveRoomPayload) {
    client.leave(payload.room_id);
    this.online_users.filter((user) => user.user_id !== client.user.user_id);
    client.emit('users', this.online_users);
  }
}

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '../chat.service';
import { isSuccess } from '../../../utils/isSuccess.typeguard';
import { WebsocketExceptionsFilter } from '../../../utils/WsIoException';
import { UserService } from '../../user/user.service';
import { WsAuthMiddleware } from '../../auth/guards/socketio.guard';
import { JwtService } from '@nestjs/jwt';
import { UseFilters } from '@nestjs/common';
import { AuthService, LoginPayload } from '../../auth/auth.service';

@WebSocketGateway({ cors: { origin: process.env.FRONT_END_URL, credentials: true } })
@UseFilters(WebsocketExceptionsFilter)
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private jwt: JwtService,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // using middleware
  afterInit(server: Server) {
    const middle = WsAuthMiddleware(this.jwt);
    server.use(middle);
  }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('get-user-data')
  async getChats(client) {
    const user: LoginPayload = client['user'];

    this.broadCastChats(user.user_id);
    this.broadCastMe(user.user_id);
    this.broadCastContacts(user.user_id);
  }

  // broadcasting user chats
  private async broadCastChats(user_id) {
    const response = await this.chatService.getUserChats(user_id);
    if (!isSuccess(response)) {
      throw new WsException({ message: response.error.message, status: response.error.statusCode });
    }
    this.server.emit('chats', response.data);
  }

  // broadcasting user details
  private async broadCastMe(user_id: string) {
    const response = await this.userService.getUser(user_id);
    if (!isSuccess(response)) {
      throw new WsException({ message: response.error.message, status: response.error.statusCode });
    }
    this.server.emit('me', response.data);
  }

  // broadcasting user contacts
  private async broadCastContacts(user_id: string) {
    const response = await this.userService.getUser(user_id);
    if (!isSuccess(response)) {
      throw new WsException({ message: response.error.message, status: response.error.statusCode });
    }
    this.server.emit('contacts', response.data);
  }

  // handling connection
  handleDisconnect(client: any) {
    console.log(client.id + ' Disconnected');
  }
  handleConnection(client: any) {
    console.log(client.id + ' connected');
  }
}

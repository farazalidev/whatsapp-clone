import { WebSocketGateway, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { MessageEntity } from '../modules/chat/entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { ISocket, leaveRoomPayload, sendMessagePayload } from '@shared/types';
import { onEvent } from '../utils/onEvent';
import { pubsubService } from '../services/pubsub.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { RoomService } from '../services/room.service';
import { OnlineUsersService } from '../services/onlineUsers.service';
import { Server } from 'socket.io';
import { WsAuthMiddleware } from '../modules/auth/guards/socketio.guard';
import { ConsumerService } from '../modules/kafka/consumer.service';
import { ProducerService } from '../modules/kafka/producer.service';
import { MessageJSON } from './types/message.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import { ChatService } from '../modules/chat/chat.service';

// Define a helper function to extract event names

@WebSocketGateway({ cors: { credentials: true, origin: [process.env.FRONT_END_URL] } })
export class MessageGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  constructor(
    private jwt: JwtService,
    @InjectRedis() private redis: Redis,
    private pubsub: pubsubService,
    private consumerService: ConsumerService,
    private producerService: ProducerService,
    private roomService: RoomService,
    private onlineUsersService: OnlineUsersService,
    private chatService: ChatService,
    @InjectRepository(MessageEntity) private messageRepo: Repository<MessageEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  afterInit(server: Server) {
    server.use(WsAuthMiddleware(this.userRepo));
  }
  handleConnection(client: ISocket) {
    console.log(client.user.user_id);
  }

  async handleDisconnect(client: ISocket) {
    const user_id = client.user.user_id;
    await this.roomService.removeAllUserRooms(user_id);
    console.log('user removed from the room');
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

  @onEvent('get_unread_messages')
  async getNewMessages(client: ISocket) {
    const user_id = client.user.user_id;
    client.emit(`unread_messages_${user_id}`, await this.chatService.getUnreadMessages(user_id));
  }

  @onEvent('send_message')
  async sendMessage(client: ISocket, payload: sendMessagePayload) {
    const newMessage = this.messageRepo.create({
      from: client.user,
      content: payload.message.content,
    });

    // processing message
    const processedMessage = await this.messageProcessor(newMessage, payload.chat_id, payload.receiverId);

    const messageJSON: MessageJSON = {
      sender: client?.user.user_id,
      receiver: payload.receiverId,
      chat_id: payload.chat_id,
      message: processedMessage.message,
    };

    // Producing message in kafka
    await this.producerService.produce('MESSAGE', { value: JSON.stringify(messageJSON), key: 'message' });

    // emitting message to sender side
    this.server.emit(`user_${client.user.user_id}`, newMessage);

    if (!processedMessage.isUserInTheRoom) {
      if (!processedMessage.isUserOnline) {
        // if the user is not online at all
        // sends push notification
        // TODO: Send a push notification
      }
      // if the user is not in the room then sends message notification
      // TODO: Send a message notification

      // sending unread to the receiver
      this.server.emit(`unread_messages_${payload.receiverId}`, await this.chatService.getUnreadMessages(payload.receiverId));

      return;
    }

    // emitting message to the room side
    client.to(payload.chat_id).emit('newMessage', newMessage);
  }

  @onEvent('leave_room')
  async leaveRoom(client: ISocket, payload: leaveRoomPayload) {
    client.leave(payload.room_id);
    console.log(`user leaves room ${payload.room_id} user ${client.user.user_id}`);

    await this.roomService.removeUserFromRoom(payload.room_id, client.user.user_id);
  }

  /**
   *
   * @param message sended message
   * @param chat_id room of the chat
   * @param receiver_id message receiver id
   *
   * When the client(user) sends a message, checking if the message is received by the
   * receiver or not and seen.
   */
  private async messageProcessor(
    message: MessageEntity,
    chat_id: string,
    receiver_id: string,
  ): Promise<{ message: MessageEntity; isUserOnline: boolean; isUserInTheRoom: boolean }> {
    const isReceiverInTheRoom = await this.roomService.isUserInTheRoom(chat_id, receiver_id);

    // checking user online availability
    let receiver_pid;

    await this.onlineUsersService.getUserPid(receiver_id, (err, pid) => {
      if (err) {
        receiver_pid = null;
      }
      receiver_pid = pid;
    });

    if (isReceiverInTheRoom) {
      // message is sended and seen by the receiver
      message.received_at = new Date();
      message.seen_at = new Date();
      message.is_seen = true;
      return { message, isUserInTheRoom: isReceiverInTheRoom, isUserOnline: Boolean(receiver_pid) };
    }

    if (!isReceiverInTheRoom) {
      // if receiver is not in the room

      // user not in the room but online
      message.received_at = new Date();

      // add to unread messages
      await this.chatService.saveUnReadMessage(message, chat_id, receiver_id);
      return { isUserInTheRoom: isReceiverInTheRoom, isUserOnline: Boolean(receiver_pid), message };
    }

    if (!receiver_pid) {
      // the receiver is completely offline
      return { message, isUserInTheRoom: false, isUserOnline: false };
    }
  }
}

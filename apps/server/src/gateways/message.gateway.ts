import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { MessageEntity } from '../modules/chat/entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { ISocket, leaveRoomPayload, sendMessagePayload, typingPayload } from '@shared/types';
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
export class MessageGateway implements OnGatewayInit {
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

  @WebSocketServer()
  server: ISocket;

  /**
   *
   * @param client client socket
   * @param payload receiving payload to create or join room
   */
  @onEvent('join_room')
  async joinRoom(client: ISocket, payload: { chat_id: string }) {
    await this.roomService.joinOrCreateRoom(payload.chat_id, client.user.user_id, process.env.PID);
    // when the user joins the room update its online status
    this.server.emit(`status_user_${client.user.user_id}`, true);

    client.join(payload.chat_id);
  }

  /**
   *
   * @param client client socket
   */
  @onEvent('get_unread_messages')
  async getNewMessages(client: ISocket) {
    const user_id = client.user.user_id;
    client.emit(`unread_messages_${user_id}`, await this.chatService.getUnreadMessagesForUser(user_id));
  }

  /**
   *
   * @param client client socket
   * @param payload payload to send message
   * @returns void
   */
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

      return;
    }

    // emitting message to the room side
    client.to(payload.chat_id).emit('newMessage', newMessage);
  }

  @onEvent('typing')
  async typing(client: ISocket, payload: typingPayload) {
    this.server.emit(`typing_${payload.chat_id}_${payload.user_id}`);
  }

  @onEvent('stop_typing')
  async stopTyping(client: ISocket, payload: typingPayload) {
    this.server.emit(`stop_typing_${payload.chat_id}_${payload.user_id}`);
  }

  @onEvent('leave_room')
  async leaveRoom(client: ISocket, payload: leaveRoomPayload) {
    client.leave(payload.room_id);
    // when the user leaves room update its online status
    this.server.emit(`status_user_${client.user.user_id}`, false);
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

    // if the receiver is not in the room but online
    // then the sended message will be received
    if (!isReceiverInTheRoom && (await receiver_pid)) {
      // message received by the receiver
      message.received_at = new Date();
      this.server.emit(`unread_message_${receiver_id}`, { chat_id, message });
      return { isUserInTheRoom: isReceiverInTheRoom, isUserOnline: Boolean(await receiver_pid), message };
    }

    // if the receiver is in the room the message is received and seen by receiver
    if (isReceiverInTheRoom) {
      // message is sended and seen by the receiver
      message.received_at = new Date();
      message.seen_at = new Date();
      message.is_seen = true;
      return { message, isUserInTheRoom: isReceiverInTheRoom, isUserOnline: Boolean(receiver_pid) };
    }

    // if the user is not in the room and completely offline then just save the message in the database
    if (!receiver_pid) {
      return { message, isUserInTheRoom: false, isUserOnline: false };
    }
  }

  /**
   *
   * @param client client socket
   */
  @onEvent('make_user_online')
  async makeUserOnline(client: ISocket) {
    this.onlineUsersService.addUserToRedis(client.user.user_id, process.env.PID);
  }
}

import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { MessageEntity } from '../modules/chat/entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { IMessageStatus, ISocket, leaveRoomPayload, sendMessagePayload, typingPayload } from '@shared/types';
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
import { isSuccess } from '../utils/isSuccess.typeguard';
import { UserChatEntity } from '../modules/chat/entities/userchat.entity';
import { SubscriptionEntity } from '../modules/user/entities/subscription.entity';
import { sendPushNotification } from '../utils/sendPushNotification';

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
    @InjectRepository(SubscriptionEntity) private subRepo: Repository<SubscriptionEntity>,
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
    // updating message status bulk
    const response = await this.chatService.updateMessagesStatusToSeen(payload.chat_id, client.user.user_id);

    if (isSuccess(response)) {
      let receiver_pid;

      await this.onlineUsersService.getUserPid(response.data.receiver_id, (err, pid) => {
        if (err) {
          receiver_pid = null;
        }
        receiver_pid = pid;
      });
      if (receiver_pid) {
        // emitting new status for messages
        client.to(response.data.receiver_id).emit(`update_message_status_bulk`, { chat_id: payload.chat_id, messages: response.data.messages });
      }
    }

    await this.roomService.joinOrCreateRoom(payload.chat_id, client.user.user_id, process.env.PID);
    // when the user joins the room update its online status
    this.server.emit(`status_user_${client.user.user_id}`, true);
    client.join(payload.chat_id);
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
      id: payload.message.id,
      sended_at: payload.message.sended_at,
      media: payload.message.media,
      messageType: payload.message.messageType,
      clear_for: null,
    });

    // processing message
    const processedMessage = await this.messageProcessor(newMessage, payload.chat, payload.receiverId);

    const messageJSON: MessageJSON = {
      sender: client?.user.user_id,
      receiver: payload.receiverId,
      chat: payload.chat,
      message: { ...processedMessage.message, ...processedMessage.messageStatus.status },
    };

    // Producing message in kafka
    await this.producerService.produce('MESSAGE', { value: JSON.stringify(messageJSON), key: 'message' });

    // client.emit('message_status', processedMessage.messageStatus);
    client.emit('message_status', { ...processedMessage.messageStatus, status: { ...processedMessage.messageStatus.status, sended: true } });

    if (!processedMessage.isUserInTheRoom) {
      if (!processedMessage.isUserOnline) {
        // if the user is not online at all
        // sends push notification
        const subscription = await this.subRepo.findOne({ where: { user: { user_id: payload.receiverId } }, relations: { user: true } });
        const messageBody =
          payload.message.messageType === 'image' || payload.message.messageType === 'svg'
            ? 'sended an Image'
            : payload.message.messageType === 'audio'
              ? 'sended an Audio'
              : payload.message.messageType === 'pdf'
                ? 'sended a Pdf'
                : payload.message.messageType === 'video'
                  ? 'sended a Video'
                  : payload.message.messageType === 'text'
                    ? `message: ${payload.message?.content}`
                    : payload.message.messageType === 'others'
                      ? 'sended a File'
                      : 'new Message';
        const notificationPayload = {
          title: `New message from ${client.user.name}`,
          body: messageBody,
          icon: `${process.env.ASSETS_SERVER_URL}/api/file/get-profile-pic/${payload.receiverId}/small`,
          data: {
            url: `${process.env.FRONT_END_URL}/user`,
          },
          tag: payload?.chat?.id,
        };

        const status = await sendPushNotification({ payload: JSON.stringify(notificationPayload), subscription });
        // if the user unregister the service worker the remove the subscription
        if (status === 'gone') {
          await this.subRepo.delete({ user: { user_id: payload.receiverId } });
        }
      }
      // if the user is not in the room then sends message notification
      // TODO: Send a message notification
      client.emit(`unread_message_${payload.receiverId}`, { chat_id: payload?.chat?.id, message: payload.message });

      return;
    }

    // emitting message to the room side
    client.to(payload.chat.id).emit('newMessage', { chat_id: payload.chat.id, message: newMessage });
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
    chat: UserChatEntity,
    receiver_id: string,
  ): Promise<{
    message: MessageEntity;
    isUserOnline: boolean;
    isUserInTheRoom: boolean;
    messageStatus: IMessageStatus;
  }> {
    const isReceiverInTheRoom = await this.roomService.isUserInTheRoom(chat.id, receiver_id);

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
      const received_at = new Date();
      // message received by the receiver
      message.received_at = received_at;
      this.server.emit(`unread_message_${receiver_id}`, { chat_id: chat.id, message });
      return {
        isUserInTheRoom: isReceiverInTheRoom,
        isUserOnline: Boolean(await receiver_pid),
        message,
        messageStatus: {
          chat_id: chat.id,
          message_id: message.id,
          status: { is_seen: false, received_at, seen_at: null, sended_at: message.sended_at, sended: false },
        },
      };
    }

    // if the receiver is in the room the message is received and seen by receiver
    if (receiver_id !== undefined && isReceiverInTheRoom) {
      // message is sended and seen by the receiver
      const received_at = new Date();
      const seen_at = new Date();
      message.received_at = received_at;
      message.seen_at = seen_at;
      message.is_seen = true;
      return {
        message,
        isUserInTheRoom: isReceiverInTheRoom,
        isUserOnline: Boolean(receiver_pid),
        messageStatus: {
          chat_id: chat.id,
          message_id: message.id,
          status: { is_seen: true, received_at, seen_at, sended_at: message.sended_at, sended: false },
        },
      };
    }

    // if the user is not in the room and completely offline then just save the message in the database
    if (!receiver_pid) {
      return {
        message,
        isUserInTheRoom: false,
        isUserOnline: false,
        messageStatus: {
          chat_id: chat.id,
          message_id: message.id,
          status: { is_seen: false, received_at: null, seen_at: null, sended_at: message.sended_at, sended: false },
        },
      };
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

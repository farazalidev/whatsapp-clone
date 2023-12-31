import { Socket } from 'socket.io';
import { MessageEntity } from '../../apps/server/src/modules/chat/entities/message.entity';
import { UserEntity } from '../../apps/server/src/modules/user/entities/user.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';

export interface ISocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  user: UserEntity;
}

type ChatEventPattern = `user_${string}`;
type NewMessagesEventPattern = `unread_messages_${string}`;

export interface ServerToClientEvents {
  newMessage: (message: MessageEntity) => void;
  users: (users: any) => void;
  get_pid: (pid: string) => void;
  [event: ChatEventPattern]: (message: MessageEntity) => void;
  [new_messages: NewMessagesEventPattern]: (messages: INewMessages[]) => void;
}
export interface ClientToServerEvents {
  send_message: (payload: sendMessagePayload) => void;
  join_room: (payload: joinRoomPayload) => void;
  leave_room: (payload: leaveRoomPayload) => void;
  get_online_users: () => void;
  make_user_online: () => void;
  init_room: (payload: { chat_id: string }) => void;
  get_unread_messages: () => void;
}

export interface sendMessagePayload {
  message: messageFromClient;
  chat_id: string | undefined;
  receiverId: string;
}

export interface messageFromClient {
  content: string | undefined;
}

export interface joinRoomPayload {
  chat_id: string | undefined;
}

export interface leaveRoomPayload {
  room_id: string;
}

export interface RemoveUserFromRoomPayload {
  chat_id: string;
}

export interface INewMessages {
  chat_id: string;
  messages: MessageEntity[];
}

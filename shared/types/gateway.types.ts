import { Socket } from 'socket.io';
import { MessageEntity } from '../../apps/server/src/modules/chat/entities/message.entity';

export interface ISocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  user: { user_id: string };
}

type ChatEventPattern = `user_${string}`;

export interface ServerToClientEvents {
  newMessage: (message: MessageEntity) => void;
  users: (users: any) => void;
  get_pid: (pid: string) => void;
  [event: ChatEventPattern]: (message: MessageEntity) => void;
}
export interface ClientToServerEvents {
  send_message: (payload: sendMessagePayload) => void;
  join_room: (payload: joinRoomPayload) => void;
  leave_room: (payload: leaveRoomPayload) => void;
  get_online_users: () => void;
  make_user_online: () => void;
  remove_user_from_room: (payload: RemoveUserFromRoomPayload) => void;
  init_room: (payload: { chat_id: string }) => void;
}

export interface sendMessagePayload {
  message: MessageEntity | undefined;
  chat_id: string | undefined;
  receiverId: string;
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

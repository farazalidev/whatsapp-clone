import { MessageEntity } from '../../../apps/server/src/modules/chat/entities/message.entity';

type ChatEventPattern = `user_${string}`;

export interface ServerToClientEvents {
  newMessage: (message: MessageEntity) => void;
  users: (users: any) => void;
  [event: ChatEventPattern]: (message: MessageEntity) => void;
}
export interface ClientToServerEvents {
  send_message: (payload: sendMessagePayload) => void;
  join_room: (payload: joinRoomPayload) => void;
  leave_room: (payload: leaveRoomPayload) => void;
  get_online_users: () => void;
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

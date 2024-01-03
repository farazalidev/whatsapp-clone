import { Socket } from 'socket.io';
import { MessageEntity } from '../../apps/server/src/modules/chat/entities/message.entity';
import { UserEntity } from '../../apps/server/src/modules/user/entities/user.entity';
import { single_unread_message, unreadMessage } from '../../apps/server/src/modules/types';

export interface ISocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  user: UserEntity;
}
// string is user id
type ChatEventPattern = `user_${string}`;
/**
 * string is for user id
 */
type unreadMessagesEventPattern = `unread_messages_${string}`;
/**
 * single unread message
 */
type unread_single_messagePattern = `unread_message_${string}`;
/**
 * First string is room id and second string is user id
 */
type TypingIndicatorEventPattern = `typing_${string}_${string}`;
/**
 * First string is room id and second string is user id
 */
type stopTypingIndicatorEventPattern = `stop_typing_${string}_${string}`;

type user_online_statusPattern = `status_user_${string}`;

export interface ServerToClientEvents {
  newMessage: (message: MessageEntity) => void;
  get_pid: (pid: string) => void;
  [event: ChatEventPattern]: (message: MessageEntity) => void;
  [event: unreadMessagesEventPattern]: (messages: unreadMessage[]) => void;
  [event: unread_single_messagePattern]: (message: single_unread_message) => void;
  [event: TypingIndicatorEventPattern]: () => void;
  [event: stopTypingIndicatorEventPattern]: () => void;
  [event: user_online_statusPattern]: (status: boolean) => void;
}
export interface ClientToServerEvents {
  send_message: (payload: sendMessagePayload) => void;
  join_room: (payload: joinRoomPayload) => void;
  leave_room: (payload: leaveRoomPayload) => void;
  get_online_users: () => void;
  make_user_online: () => void;
  init_room: (payload: { chat_id: string }) => void;
  get_unread_messages: () => void;
  typing: (payload: typingPayload) => void;
  stop_typing: (payload: typingPayload) => {};
  get_user_online_status: (payload: getUserOnlineStatusPayload) => void;
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

export interface typingPayload {
  user_id: string;
  chat_id: string;
}

export interface getUserOnlineStatusPayload {
  user_id: string;
}

export interface userOnlinePayload {
  status: boolean;
}

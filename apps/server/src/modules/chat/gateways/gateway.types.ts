import { UserChatEntity } from '../entities/userchat.entity';

export interface ServerToClientEvents {
  getChats: (chats: UserChatEntity[]) => void;
}

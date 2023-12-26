import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';

export function isIamReceiver(chat: UserChatEntity | undefined, my_user_id: string | undefined) {
  return chat?.chat_with.user_id === my_user_id;
}

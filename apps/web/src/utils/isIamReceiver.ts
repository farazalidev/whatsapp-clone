import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';

export function isIamReceiver(chat: UserChatEntity, my_user_id: string) {
  return chat.chat_with.user_id === my_user_id;
}

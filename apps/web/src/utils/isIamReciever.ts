import { UserDataType } from './getDetailsForChatPanel';

export function isIamReceiver(userData: UserDataType) {
  return userData?.chats.some((chat) => chat.chat_with.user_id === userData.Me.user_id);
}

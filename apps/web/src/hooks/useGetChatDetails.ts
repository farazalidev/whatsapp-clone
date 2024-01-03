'use client';
import { IChatSlice } from '@/global/features/ChatSlice';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { isIamReceiver } from '../utils/isIamReceiver';

export type UserDataType =
  | {
      Me: UserEntity;
      chats: UserChatEntity[];
      contacts: ContactEntity[];
    }
  | undefined;

type getDetailsForChatPanelResponse = {
  name: string | undefined;
  avatar_path: string | undefined;
  receiver_id: string | undefined;
  chat_id: string | undefined;
};

export function useUserChatDetails(chat_slice: IChatSlice, userData: UserDataType): getDetailsForChatPanelResponse {
  const { id, started_from } = chat_slice;

  const chat = userData?.chats.find((chat) => {
    return chat.id === id;
  });

  /**
   * if the id is the user_id
   * Means chat is started from contact
   * having not chats before
   */

  if (started_from === 'contact') {
    const contact = userData?.contacts.find((contact) => contact.contact.user_id === id);

    return {
      avatar_path: contact?.contact.profile.pic_path,
      name: contact?.contact.name,
      receiver_id: contact?.contact.user_id,
      chat_id: undefined,
    };
  }

  /**
   * if the chat is started from chats
   * and have chat before
   */

  const isReceiver = isIamReceiver(chat?.chat_with.user_id, userData?.Me.user_id as string);

  return {
    avatar_path: isReceiver ? chat?.chat_for.profile.pic_path : chat?.chat_with.profile.pic_path,
    name: isReceiver ? chat?.chat_for.name : chat?.chat_with.name,
    receiver_id: isReceiver ? chat?.chat_for.user_id : chat?.chat_with.user_id,
    chat_id: chat?.id,
  };
}

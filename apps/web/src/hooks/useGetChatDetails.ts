'use client';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { isIamReceiver } from '../utils/isIamReceiver';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';

export type UserDataType =
  | {
      Me: UserEntity;
      chats: UserChatEntity[];
      contacts: ContactEntity[];
    }
  | undefined;

type getDetailsForChatPanelResponse = {
  chat_id: string | undefined;
  receiver: UserEntity;
};

export function useUserChatDetails(): getDetailsForChatPanelResponse {
  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { Me, contacts } = useSelector((state: RootState) => state.UserSlice);

  const { chats_raw: chats } = useSelector((state: RootState) => state.messagesSlice);

  const { id, started_from } = chatSlice;

  const chat = chats.find((chat) => {
    return chat.id === id;
  });

  /**
   * if the id is the user_id
   * Means chat is started from contact
   * having not chats before
   */

  if (started_from === 'contact') {
    const contact = contacts?.find((contact) => contact.contact.user_id === id);

    return {
      chat_id: undefined,
      receiver: contact?.contact as any,
    };
  }

  /**
   * if the chat is started from chats
   * and have chat before
   */

  const isReceiver = isIamReceiver(chat?.chat_with.user_id, Me?.user_id as string);

  return {
    receiver: isReceiver ? chat?.chat_for : (chat?.chat_with as any),
    chat_id: chat?.id,
  };
}

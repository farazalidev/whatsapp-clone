'use client';
import { fetcher } from '@/utils/fetcher';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import useSwr from 'swr';
import { useDispatch } from 'react-redux';
import { addNewChat, addRawChats } from '@/global/features/messagesSlice';
import { AxiosError } from 'axios';
import { mainDb } from '@/utils/mainIndexedDB';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { useMemo } from 'react';

const useChats = () => {
  const dispatch = useDispatch();
  const userFetcher = async () => {
    const chats = await fetcher<UserChatEntity[]>('chat/user-chats');

    return { chats };
  };

  const result = useSwr<{ chats: UserChatEntity[] }, AxiosError>('api/chats', userFetcher);
  dispatch(addRawChats(result.data?.chats));
  const saveChat = async () => {
    let localMessages: MessageEntity[];
    if (typeof window !== 'undefined') {
      localMessages = await mainDb?.mediaMessages.toArray();
    }

    result.data?.chats.map((chat) => {
      const chatMessages = localMessages.filter((localMessage) => localMessage.chat?.id === chat.id);
      dispatch(addNewChat({ chat_id: chat.id, messages: [...chat.messages, ...chatMessages] }));
    });
  };
  saveChat();
  return useMemo(() => result, [result]);
};

export default useChats;

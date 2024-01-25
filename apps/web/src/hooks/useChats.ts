'use client';
import { fetcher } from '@/utils/fetcher';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import useSwr from 'swr';
import { useDispatch } from 'react-redux';
import { addNewChat, addRawChats } from '@/global/features/messagesSlice';
import { AxiosError } from 'axios';
import { mainDb } from '@/utils/mainIndexedDB';

const useChats = () => {
  const dispatch = useDispatch();
  const userFetcher = async () => {
    const chats = await fetcher<UserChatEntity[]>('chat/user-chats');

    return { chats };
  };

  const result = useSwr<{ chats: UserChatEntity[] }, AxiosError>('api/chats', userFetcher);
  dispatch(addRawChats(result.data?.chats));
  const saveChat = async () => {
    const localMediaMessages = await mainDb?.mediaMessages.toArray();

    result.data?.chats.forEach(async (chat) => {
      dispatch(addNewChat({ chat_id: chat.id, messages: [...chat.messages, ...localMediaMessages] }));
    });
  };
  saveChat();
  return result;
};

export default useChats;

'use client';
import { fetcher } from '@/utils/fetcher';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import useSwr from 'swr';
import { useDispatch } from 'react-redux';
import { addNewChat, addRawChats } from '@/global/features/messagesSlice';
import { AxiosError } from 'axios';

const useChats = () => {
  const dispatch = useDispatch();
  const userFetcher = async () => {
    const chats = await fetcher<UserChatEntity[]>('chat/user-chats');

    return { chats };
  };

  const result = useSwr<{ chats: UserChatEntity[] }, AxiosError>('api/chats', userFetcher);
  dispatch(addRawChats(result.data?.chats));
  result.data?.chats.forEach(async (chat) => {
    dispatch(addNewChat({ chat_id: chat.id, messages: chat.messages }));
  });
  return result;
};

export default useChats;

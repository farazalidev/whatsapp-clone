'use client';
import { fetcher } from '@/utils/fetcher';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import useSwr from 'swr';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { useDispatch } from 'react-redux';
import { setUser } from '@/global/features/UserSlice';
import { addNewChat } from '@/global/features/messagesSlice';

const useUser = () => {
  const dispatch = useDispatch();
  const userFetcher = async () => {
    const Me = await fetcher<UserEntity>('user/me');
    const chats = await fetcher<UserChatEntity[]>('chat/user-chats');
    const contacts = await fetcher<ContactEntity[]>('user/contacts');

    return { Me, chats, contacts };
  };

  const result = useSwr('api/user', userFetcher);
  dispatch(setUser(result.data));
  result.data?.chats.forEach(async (chat) => {
    dispatch(addNewChat({ chat_id: chat.id, messages: chat.messages }));
  });
  return result;
};

export default useUser;

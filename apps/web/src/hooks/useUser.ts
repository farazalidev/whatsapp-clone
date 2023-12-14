'use client';
import { fetcher } from '@/utils/fetcher';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import useSwr from 'swr';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';

const useUser = () => {
  const userFetcher = async () => {
    const Me = await fetcher<UserEntity>('user/me');
    const chats = await fetcher<UserChatEntity[]>('chat/user-chats');
    const contacts = await fetcher<ContactEntity[]>('user/contacts');

    return { Me, chats, contacts };
  };

  return useSwr('api/user', userFetcher, { revalidateOnFocus: false });
};

export default useUser;

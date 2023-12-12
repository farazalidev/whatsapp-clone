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

    let profile_pic;
    if (await Me.profile?.pic_path) {
      profile_pic = await fetcher<string>(`user/profile-image/${Me.profile?.pic_path}`, undefined, 'blob');
    }

    const contactsWithProfileBlob = await Promise.all(
      contacts.map(async (contact) => {
        const profile_pic = await fetcher<Blob>(`user/profile-image/${contact.contact.profile?.pic_path}`, undefined, 'blob');
        return { Contact: contact, profile_blob: profile_pic };
      }),
    );

    return { Me, chats, contacts: contactsWithProfileBlob, profile_pic };
  };

  return useSwr('api/user', userFetcher, { revalidateOnFocus: false });
};

export default useUser;

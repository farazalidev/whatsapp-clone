'use client';
import { fetcher } from '@/utils/fetcher';
import useSwr from 'swr';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { useDispatch } from 'react-redux';
import { setUser } from '@/global/features/UserSlice';
import { AxiosError } from 'axios';

const useContacts = () => {
  const dispatch = useDispatch();
  const userFetcher = async () => {
    const contacts = await fetcher<ContactEntity[]>('user/contacts');

    return { contacts };
  };

  const result = useSwr<{ contacts: ContactEntity[] }, AxiosError>('api/contacts', userFetcher);
  dispatch(setUser(result.data));
  return result;
};

export default useContacts;

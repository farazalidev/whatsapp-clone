'use client';
import { fetcher } from '@/utils/fetcher';
import { useDispatch } from 'react-redux';
import { addLocalMediaMessages, initPaginatedChats } from '@/global/features/messagesSlice';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { ChatsDto } from '@server/modules/chat/DTO/chats.dto';
import { chatPaginationConfig } from '@/config/chatPagination.config';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';

interface IUseChatsState {
  isLoading: boolean;
  error: AxiosError | undefined;
  isError: boolean;
}

interface IUseChatsReturn {
  state: IUseChatsState;
  chats: ChatsDto | undefined;
}

type IUseChats = () => IUseChatsReturn;

export const useChats: IUseChats = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState<IUseChatsState>({ error: undefined, isError: false, isLoading: false });
  const [chats, setChats] = useState<ChatsDto | undefined>(undefined);

  useEffect(() => {
    const initChatFetch = async () => {
      try {
        const result = await fetcher<ChatsDto>(
          `chat/user-chats?page=${chatPaginationConfig.page}&messagesPage=${chatPaginationConfig.messagesPage}&take=${chatPaginationConfig.take}&messagesTake=${chatPaginationConfig.messagesTake}&order=${chatPaginationConfig.order}`,
        );
        dispatch(initPaginatedChats(result));
        const localMediaMessages = await mainDb.mediaMessages.toArray();
        dispatch(addLocalMediaMessages(localMediaMessages));
        setChats(result);
      } catch (error: any) {
        setState((prev) => {
          return { ...prev, error, isError: true };
        });
      } finally {
        setState((prev) => {
          return { ...prev, isLoading: false };
        });
      }
    };
    initChatFetch();
  }, [dispatch]);

  return useMemo(() => {
    return { chats, state };
  }, [chats, state]);
};
'use client';
import { fetcher } from '@/utils/fetcher';
import useSwr from 'swr';
import { useDispatch } from 'react-redux';
import { addNewChat, addRawChats, initPaginatedChats } from '@/global/features/messagesSlice';
import { AxiosError } from 'axios';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { useEffect, useMemo, useState } from 'react';
import { ChatsDto } from '@server/modules/chat/DTO/chats.dto';
import { chatPaginationConfig } from '@/config/chatPagination.cnfig';

const useChats = () => {
  const dispatch = useDispatch();

  const userFetcher = async () => {
    const chats = await fetcher<ChatsDto>(
      `chat/user-chats?page=${chatPaginationConfig.page}&messagesPage=${chatPaginationConfig.messagesPage}&take=${chatPaginationConfig.take}&messagesTake=${chatPaginationConfig.messagesTake}&order=${chatPaginationConfig.order}`,
    );
    return { chats };
  };

  const result = useSwr<{ chats: ChatsDto }, AxiosError>('api/chats', userFetcher, {
    revalidateOnFocus: false,
  });

  if (result.data?.chats) {
    dispatch(initPaginatedChats(result.data?.chats));
  }
  dispatch(addRawChats(result.data?.chats.data));
  const saveChat = async () => {
    let localMessages: MessageEntity[];
    if (typeof window !== 'undefined') {
      localMessages = await mainDb?.mediaMessages.toArray();
    }

    result.data?.chats.data.map((chat) => {
      const chatMessages = localMessages.filter((localMessage) => localMessage.chat?.id === chat.id);
      dispatch(addNewChat({ chat_id: chat.id, messages: [...chat.messages, ...chatMessages] }));
    });
  };
  saveChat();
  return useMemo(() => result, [result]);
};

export default useChats;

interface IUseChats2State {
  isLoading: boolean;
  error: AxiosError | undefined;
  isError: boolean;
}

interface IUseChatsReturn {
  state: IUseChats2State;
  chats: ChatsDto | undefined;
}

type IUseChats2 = () => IUseChatsReturn;

export const useChats2: IUseChats2 = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState<IUseChats2State>({ error: undefined, isError: false, isLoading: false });
  const [chats, setChats] = useState<ChatsDto | undefined>(undefined);

  useEffect(() => {
    const initChatFetch = async () => {
      try {
        const result = await fetcher<ChatsDto>(
          `chat/user-chats?page=${chatPaginationConfig.page}&messagesPage=${chatPaginationConfig.messagesPage}&take=${chatPaginationConfig.take}&messagesTake=${chatPaginationConfig.messagesTake}&order=${chatPaginationConfig.order}`,
        );

        dispatch(initPaginatedChats(result));
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
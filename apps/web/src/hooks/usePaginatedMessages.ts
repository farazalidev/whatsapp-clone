import { paginateChatMessages } from '@/global/features/messagesSlice';
import { fetcher } from '@/utils/fetcher';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PaginatedMessages, PaginatedMessagesMeta } from '@server/modules/chat/DTO/chats.dto';
import { RootState } from '@/global/store';
import { chatPaginationConfig } from '@/config/chatPagination.config';

interface IUsePaginateChatMessagesArgs {
  chat_id: string | undefined;
}

interface IUsePaginatedMessagesState {
  isLoading: boolean;
  isError: boolean;
}

type IUsePaginateChatMessages = (args: IUsePaginateChatMessagesArgs) => {
  state: IUsePaginatedMessagesState;
  paginate: () => void;
  meta: Partial<PaginatedMessagesMeta>;
};

const usePaginatedMessages: IUsePaginateChatMessages = (args) => {
  const dispatch = useDispatch();

  const [state, setState] = useState<IUsePaginatedMessagesState>({ isError: false, isLoading: false });

  const chat = useSelector((state: RootState) => state.messagesSlice.paginatedChats.data.find((chat) => chat.id === args.chat_id));
  const paginate = useCallback(async () => {
    try {
      if (args.chat_id && chat && chat.hasNext) {
        setState((prev) => {
          return { ...prev, isLoading: true };
        });
        const paginatedMessages = await fetcher<PaginatedMessages>(
          `chat/get-paginated-messages/${args.chat_id}?messagesPage=${chat?.currentPage + 1}&messagesTake=${chatPaginationConfig.messagesTake}&order=${chatPaginationConfig.order}`,
        );
        dispatch(paginateChatMessages({ chat_id: args.chat_id, paginatedMessages }));
      }
    } catch (error) {
      setState((prev) => {
        return { ...prev, isError: true };
      });
    } finally {
      setState((prev) => {
        return { ...prev, isLoading: false };
      });
    }
  }, [args.chat_id, chat, dispatch]);
  return {
    state,
    paginate,
    meta: {
      currentPage: chat?.currentPage,
      hasNext: chat?.hasNext,
      hasPrevious: chat?.hasPrev,
      take: chat?.messagesTake,
      totalMessages: chat?.count,
      totalPages: chat?.totalMessagesPages,
    },
  };
};

export default usePaginatedMessages;

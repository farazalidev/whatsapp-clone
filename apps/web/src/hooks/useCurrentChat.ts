import { RootState } from '@/global/store';
import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { omitObject } from '@/utils/OmitObject';

const useCurrentChat = () => {
  const { id } = useSelector((state: RootState) => state.ChatSlice);
  const chat = useSelector((state: RootState) => state.messagesSlice.paginatedChats.data.find((chat) => chat.id === id));

  const getWawChat = useCallback(() => {
    if (chat) {
      return omitObject(chat, ['totalMessagesPages', 'messagesTake', 'hasPrev', 'hasNext', 'currentPage', 'count']);
    }
  }, [chat]);
  const raw_chat = getWawChat();

  const memoData = useMemo(() => {
    return { chat, id, raw_chat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, id]);
  return memoData;
};

export default useCurrentChat;

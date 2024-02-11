import { RootState } from '@/global/store';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const useCurrentChat = () => {
  const { id } = useSelector((state: RootState) => state.ChatSlice);
  const chat = useSelector((state: RootState) => state.messagesSlice.chats.find((chat) => chat.chat_id === id));
  const raw_chat = useSelector((state: RootState) => state.messagesSlice.chats_raw.find((chat) => chat.id === id));

  const memoData = useMemo(() => {
    return { chat, id, raw_chat };
  }, [chat, id, raw_chat]);
  return memoData;
};

export default useCurrentChat;

import { RootState } from '@/global/store';
import { useSelector } from 'react-redux';

const useCurrentChat = () => {
  const { id } = useSelector((state: RootState) => state.ChatSlice);
  const chat = useSelector((state: RootState) => state.messagesSlice.chats.find((chat) => chat.chat_id === id));
  const raw_chat = useSelector((state: RootState) => state.messagesSlice.chats_raw.find((chat) => chat.id === id));

  return { chat, id, raw_chat };
};

export default useCurrentChat;

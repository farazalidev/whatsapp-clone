import React from 'react';
import ChatBanner from './ChatBanner';
import ChatPanel from './chatpanel/ChatPanel';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';

const UserChat = () => {
  const { id } = useSelector((state: RootState) => state.ChatSlice);

  return (
    <div className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg flex h-full w-full flex-col place-items-center justify-center gap-7">
      {id ? <ChatPanel /> : <ChatBanner />}
    </div>
  );
};

export default UserChat;

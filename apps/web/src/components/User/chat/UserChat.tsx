import React from 'react';
import ChatBanner from './ChatBanner';
import ChatPanel from './chatpanel/ChatPanel';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
// import ChatPanel from './chatpanel/ChatPanel';

const UserChat = () => {
  const user_id = useSelector((state: RootState) => state.ChatSlice.user_id);

  return (
    <div className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg w-full h-full flex flex-col justify-center place-items-center gap-7">
      {user_id ? <ChatPanel /> : <ChatBanner />}
    </div>
  );
};

export default UserChat;

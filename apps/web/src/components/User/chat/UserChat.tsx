import React from 'react';
import ChatBanner from './ChatBanner';
import ChatPanel from './chatpanel/ChatPanel';

const UserChat = () => {
  return (
    <div className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg w-full h-full flex flex-col justify-center place-items-center gap-7">
      {/* <ChatBanner /> */}
      <ChatPanel />
    </div>
  );
};

export default UserChat;

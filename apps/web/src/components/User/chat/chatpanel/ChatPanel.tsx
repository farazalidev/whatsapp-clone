import React from 'react';
import ChatPanelHeader from './ChatPanelHeader';
import ChatHandler from './ChatHandler';
import MessageSender from './MessageSender';

const ChatPanel = () => {
  return (
    <div className="w-full h-full  bg-pattern">
      <div className="flex flex-col w-full h-full bg-[#F5DEB3] bg-opacity-25 dark:bg-whatsapp-dark-primary_bg dark:bg-opacity-95">
        <ChatPanelHeader header_name="Faraz" />
        <ChatHandler />
        <MessageSender />
      </div>
    </div>
  );
};

export default ChatPanel;

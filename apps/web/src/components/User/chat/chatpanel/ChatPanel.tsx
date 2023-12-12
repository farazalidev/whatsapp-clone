import React from 'react';
import ChatPanelHeader from './ChatPanelHeader';
import ChatHandler from './ChatHandler';
import MessageSender from './MessageSender';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';

const ChatPanel = () => {
  const chat = useSelector((state: RootState) => state.ChatSlice);

  return (
    <div className="w-full h-full  bg-pattern">
      <div className="flex flex-col w-full h-full bg-[#F5DEB3] bg-opacity-25 dark:bg-whatsapp-dark-primary_bg dark:bg-opacity-95">
        <ChatPanelHeader header_name={chat?.chat_entity?.user.name as string} avatar_scr={chat?.avatar as string} />
        <ChatHandler messages={chat.chat_entity?.messages} />
        <MessageSender />
      </div>
    </div>
  );
};

export default ChatPanel;

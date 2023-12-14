import React, { Suspense } from 'react';
import ChatPanelHeader from './ChatPanelHeader';
import ChatHandler from './ChatHandler';
import MessageSender from './MessageSender';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import useUser from '@/hooks/useUser';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';
import { getDetailsForChatPanel } from '@/utils/getDetailsForChatPanel';

const ChatPanel = () => {
  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { data } = useUser();

  const { avatar_path, messages, name, receiver_id, chat_id } = getDetailsForChatPanel(chatSlice, data);

  return (
    <div className="bg-pattern h-full  w-full">
      <div className="dark:bg-whatsapp-dark-primary_bg flex h-full w-full flex-col bg-[#F5DEB3] bg-opacity-25 dark:bg-opacity-95">
        <Suspense fallback={<FallBackLoadingSpinner />}>
          <ChatPanelHeader header_name={name as string} avatar_path={avatar_path} />
          <ChatHandler messages={messages} />
          <MessageSender receiver_id={receiver_id as string} chat_id={chat_id} />
        </Suspense>
      </div>
    </div>
  );
};

export default ChatPanel;

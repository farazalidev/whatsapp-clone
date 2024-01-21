import React, { Suspense, useRef } from 'react';
import ChatPanelHeader from './ChatPanelHeader';
import ChatHandler from './ChatHandler';
import MessageSender from './MessageSender';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';
import { useUserChatDetails } from '@/hooks/useGetChatDetails';
import OverlayContainer from './OverlayContainer';
import { toggleDocumentOverlay } from '@/global/features/overlaySlice';

const ChatPanel = () => {
  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const user = useSelector((state: RootState) => state.UserSlice);

  const parentRef = useRef(null);

  const dispatch = useDispatch();

  const { chats_raw: chats } = useSelector((state: RootState) => state.messagesSlice);

  const { DocumentOverlayIsOpen } = useSelector((state: RootState) => state.overlaySlice);

  const { name, receiver_id, chat_id } = useUserChatDetails(chatSlice, {
    chats: chats,
    contacts: user.contacts as any,
    Me: user.Me as any,
  });

  return (
    <div className="bg-pattern h-full w-full">
      <div ref={parentRef} className="dark:bg-whatsapp-dark-primary_bg flex h-full w-full flex-col bg-[#F5DEB3] bg-opacity-25 dark:bg-opacity-95" >
        <ChatPanelHeader header_name={name as string} user_id={receiver_id} for_other receiver_id={receiver_id} chat_id={chat_id} />
        <Suspense fallback={<FallBackLoadingSpinner />}>
          {/* overlay container */}
          <OverlayContainer parentRef={parentRef} isOpen={DocumentOverlayIsOpen} onClose={() => dispatch(toggleDocumentOverlay())} />
          <ChatHandler />
          <MessageSender receiver_id={receiver_id as string} chat_id={chat_id} />
        </Suspense>
      </div>
    </div>
  );
};

export default ChatPanel;

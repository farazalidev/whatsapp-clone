import React, { Suspense, useRef } from 'react';
import ChatPanelHeader from './ChatPanelHeader';
import ChatHandler from './ChatHandler';
import MessageSender from './MessageSender';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';
import OverlayContainer from './OverlayContainer';
import { toggleDocumentOverlay } from '@/global/features/overlaySlice';

const ChatPanel = () => {

  const parentRef = useRef(null);

  const dispatch = useDispatch();

  const { DocumentOverlayIsOpen } = useSelector((state: RootState) => state.overlaySlice);

  const { id, chat_receiver } = useSelector((state: RootState) => state.ChatSlice);


  return (
    <div className="bg-pattern h-full w-full" >
      <div ref={parentRef} className="dark:bg-whatsapp-dark-primary_bg flex h-full w-full flex-col bg-[#F5DEB3] bg-opacity-25 dark:bg-opacity-95" >
        <ChatPanelHeader receiver={chat_receiver} for_other chat_id={id} />
        <Suspense fallback={<FallBackLoadingSpinner />}>
          {/* overlay container */}
          <OverlayContainer parentRef={parentRef} isOpen={DocumentOverlayIsOpen} onClose={() => dispatch(toggleDocumentOverlay())} />
          <ChatHandler />
          <MessageSender receiver_id={chat_receiver?.user_id as string} chat_id={id} />
        </Suspense>
      </div>
    </div >
  );
};

export default ChatPanel;

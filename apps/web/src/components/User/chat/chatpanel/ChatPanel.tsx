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

  const parentRef = useRef(null);

  const dispatch = useDispatch();


  const { DocumentOverlayIsOpen } = useSelector((state: RootState) => state.overlaySlice);

  const { receiver, chat_id, } = useUserChatDetails();

  return (
    <div className="bg-pattern h-full w-full" >
      <div ref={parentRef} className="dark:bg-whatsapp-dark-primary_bg flex h-full w-full flex-col bg-[#F5DEB3] bg-opacity-25 dark:bg-opacity-95" >
        <ChatPanelHeader header_name={receiver?.name as string} user_id={receiver.user_id} for_other receiver_id={receiver.user_id} chat_id={chat_id} receiver_email={receiver.user_id} />
        <Suspense fallback={<FallBackLoadingSpinner />}>
          {/* overlay container */}
          <OverlayContainer parentRef={parentRef} isOpen={DocumentOverlayIsOpen} onClose={() => dispatch(toggleDocumentOverlay())} />
          <ChatHandler />
          <MessageSender receiver_id={receiver.user_id as string} chat_id={chat_id} />
        </Suspense>
      </div>
    </div >
  );
};

export default ChatPanel;

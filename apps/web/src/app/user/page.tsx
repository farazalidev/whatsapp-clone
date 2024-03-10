'use client';
import UserSideBar from '@/components/User/Sidebar/UserSideBar';
import UserChat from '@/components/User/chat/UserChat';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../../global/store';
import { closeInstructionModal, toggleAddContactModal } from '@/global/features/ModalSlice';
import AddNewContactModalContent from '@/components/Misc/ModalContent/AddNewContactModal/AddNewContactModalContent';
import Modal from '@/components/Misc/Modal';
import UserPageLayout from './UserPageLayout';
import useUser from '@/hooks/useUser';
import MainLoadingPage from '@/components/Misc/MainLoadingPage';
import MainErrorPage from '@/components/Misc/MainErrorPage';
import SessionExpiredErrorPage from '@/components/Misc/SessionExpiredErrorPage';
import useSocket from '@/hooks/useSocket';
import { setUser } from '@/global/features/UserSlice';
import { useChats } from '@/hooks/useChats';
import useContacts from '@/hooks/useContacts';
import ProfilePreview from '@/components/User/profilePreview/ProfilePreview';
import { AnimatePresence, motion } from 'framer-motion';
import { profilePreviewAnimation } from '@/animation/profilePreviewAnimation';
import CompleteProfile from '@/components/AuthPage/CompleteProfile';
import AuthPageTop from '@/components/AuthPage/AuthPageTop';
import SideBarOverlay from '@/components/User/Sidebar/SideBarOverlay';
import { overlayContent } from '@/components/User/Sidebar/overlaycontent/overlaycontet';
import { addNewMessage, updateMessageStatusBulk } from '@/global/features/messagesSlice';
import InstructionsModal from '@/components/Misc/instructionModals/InstructionsModal';
import { getInstructionModal } from '@/data/instructionsModal';


type Props = {
  searchParams: Record<string, string> | null | undefined;
};

const UserPage: FC<Props> = () => {

  const { user_id } = useSelector((state: RootState) => state.ProfilePreviewSlice)

  const { socket } = useSocket();

  const dispatch = useDispatch();


  const { AddContactModalIsOpen, instructionsModal: { isOpen, component } } = useSelector((state: RootState) => state.modalSlice);
  const { isLoading, error, data } = useUser();
  const { state: { error: chatsError, isLoading: chatsIsLoading } } = useChats();
  const { error: contactsError, isLoading: contactsIsLoading } = useContacts();
  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  // getting pid from the socket
  useEffect(() => {
    socket.on('get_pid', (pid) => {
      store.dispatch(setUser({ pid }))
    });
    socket.emit('make_user_online');
    return () => {
      socket.off('get_pid');
      socket.disconnect();
    };
  }, [socket]);


  useEffect(() => {
    socket.on(`unread_message_${data?.Me.user_id}`, (message) => {
      store.dispatch(addNewMessage({ chat_id: message.chat_id, message: message.message }))
    })
    socket.on(`update_message_status_bulk`, (payload) => {
      if (payload.messages.length > 0)
        store.dispatch(updateMessageStatusBulk(payload))
    })
    return () => {
      socket.off(`unread_message_${data?.Me.user_id}`)
    }
  }, [data?.Me.user_id, socket])


  if (isLoading || chatsIsLoading || contactsIsLoading) {
    return <MainLoadingPage />;
  }

  if (error?.response?.status === 401 || chatsError?.response?.status === 401 || contactsError?.response?.status === 401) {
    return <SessionExpiredErrorPage />;
  }

  if (error || chatsError || contactsError) {
    return <MainErrorPage />;
  }

  if (!data?.Me.is_profile_completed) {
    return <div className='flex flex-col'>
      <AuthPageTop />
      <CompleteProfile />
    </div>
  }



  return (
    <UserPageLayout>
      <div className="flex h-full">
        <aside className="relative h-full w-[40%] flex-none flex-shrink-0 lg:w-[30%] overflow-hidden">
          <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />
          <UserSideBar />
        </aside>
        <div className="w-fit flex-1 flex-grow overflow-x-hidden">
          <UserChat />
        </div>
        <AnimatePresence key={'profile-preview'}>
          {user_id ?
            <motion.div className='w-[30% h-full] relative' {...profilePreviewAnimation}>
              <ProfilePreview />
            </motion.div> : null}
        </AnimatePresence>

        <Modal onClose={() => dispatch(toggleAddContactModal())} isOpen={AddContactModalIsOpen} content={<AddNewContactModalContent />} />
        <InstructionsModal isOpen={isOpen} onClose={() => dispatch(closeInstructionModal())} Component={getInstructionModal(component)} />
      </div>
    </UserPageLayout>
  );
};

export default UserPage;

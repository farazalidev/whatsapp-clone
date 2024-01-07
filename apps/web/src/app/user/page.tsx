'use client';
import UserSideBar from '@/components/User/Sidebar/UserSideBar';
import UserChat from '@/components/User/chat/UserChat';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../global/store';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import AddNewContactModalContent from '@/components/Misc/ModalContent/AddNewContactModal/AddNewContactModalContent';
import Modal from '@/components/Misc/Modal';
import UserPageLayout from './UserPageLayout';
import useUser from '@/hooks/useUser';
import MainLoadingPage from '@/components/Misc/MainLoadingPage';
import MainErrorPage from '@/components/Misc/MainErrorPage';
import SessionExpiredErrorPage from '@/components/Misc/SessionExpiredErrorPage';
import useSocket from '@/hooks/useSocket';
import { setUser } from '@/global/features/UserSlice';
import useChats from '@/hooks/useChats';
import useContacts from '@/hooks/useContacts';

type Props = {
  searchParams: Record<string, string> | null | undefined;
};

const UserPage: FC<Props> = () => {
  const { socket } = useSocket();

  const dispatch = useDispatch();

  // getting pid from the socket
  useEffect(() => {
    socket.on('get_pid', (pid) => {
      dispatch(setUser({ pid }));
    });
    socket.emit('make_user_online');
    return () => {
      socket.off('get_pid');
      socket.disconnect();
    };
  }, [socket, dispatch]);

  const { AddContactModalIsOpen } = useSelector((state: RootState) => state.modalSlice);

  const { isLoading, error } = useUser();
  const { error: chatsError, isLoading: chatsIsLoading } = useChats();
  const { error: contactsError, isLoading: contactsIsLoading } = useContacts();

  if (isLoading || chatsIsLoading || contactsIsLoading) {
    return <MainLoadingPage />;
  }

  if (error?.response?.status === 401 || chatsError?.response?.status === 401 || contactsError?.response?.status === 401) {
    return <SessionExpiredErrorPage />;
  }

  if (error || chatsError || contactsError) {
    return <MainErrorPage />;
  }

  return (
    <UserPageLayout>
      <div className="flex h-full ">
        <aside className="h-full w-[40%] flex-none flex-shrink-0 lg:w-[30%]">
          <UserSideBar />
        </aside>
        <div className="w-fit flex-1 flex-grow overflow-x-hidden">
          <UserChat />
        </div>
        <Modal onClose={() => dispatch(toggleAddContactModal())} isOpen={AddContactModalIsOpen} content={<AddNewContactModalContent />} />
      </div>
    </UserPageLayout>
  );
};

export default UserPage;

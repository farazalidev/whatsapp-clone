'use client';
// import Modal from '@/components/Misc/Modal';
import UserSideBar from '@/components/User/Sidebar/UserSideBar';
import UserChat from '@/components/User/chat/UserChat';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../global/store';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import AddNewContactModalContent from '@/components/Misc/ModalContent/AddNewContactModal/AddNewContactModalContent';
import Modal from '@/components/Misc/Modal';
import useUser from '@/hooks/useUser';

type Props = {
  searchParams: Record<string, string> | null | undefined;
};

const UserPage: FC<Props> = ({ searchParams }) => {
  const dispatch = useDispatch();
  const { AddContactModalIsOpen } = useSelector((state: RootState) => state.modalSlice);

  const { isLoading, error } = useUser();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  return (
    <div className="flex h-full">
      <aside className="flex-none flex-shrink-0 w-[30%] h-full">
        <UserSideBar />
      </aside>
      <div className="flex-grow flex-1">
        <UserChat />
      </div>
      <Modal onClose={() => dispatch(toggleAddContactModal())} isOpen={AddContactModalIsOpen} content={<AddNewContactModalContent />} />
    </div>
  );
};

export default UserPage;

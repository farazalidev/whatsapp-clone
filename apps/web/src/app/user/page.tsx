'use client';
import UserSideBar from '@/components/User/Sidebar/UserSideBar';
import UserChat from '@/components/User/chat/UserChat';
import React, { FC, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../global/store';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import AddNewContactModalContent from '@/components/Misc/ModalContent/AddNewContactModal/AddNewContactModalContent';
import Modal from '@/components/Misc/Modal';
import useUser from '@/hooks/useUser';
import UserPageLayout from './UserPageLayout';
import MainErrorPage from '@/components/Misc/MainErrorPage';
import MainLoadingPage from '@/components/Misc/MainLoadingPage';
import { AxiosError } from 'axios';
import SessionExpiredErrorPage from '@/components/Misc/SessionExpiredErrorPage';

type Props = {
  searchParams: Record<string, string> | null | undefined;
};

const UserPage: FC<Props> = ({ searchParams }) => {
  const dispatch = useDispatch();
  const { AddContactModalIsOpen } = useSelector((state: RootState) => state.modalSlice);

  const { isLoading, error } = useUser();

  if (isLoading) {
    return (
      <Fragment>
        <MainLoadingPage />
      </Fragment>
    );
  }

  if ((error as AxiosError).response?.status === 401) {
    return (
      <Fragment>
        <SessionExpiredErrorPage />
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        <MainErrorPage />
      </Fragment>
    );
  }

  return (
    <UserPageLayout>
      <div className="flex h-full">
        <aside className="flex-none flex-shrink-0 w-[30%] h-full">
          <UserSideBar />
        </aside>
        <div className="flex-grow flex-1">
          <UserChat />
        </div>
        <Modal onClose={() => dispatch(toggleAddContactModal())} isOpen={AddContactModalIsOpen} content={<AddNewContactModalContent />} />
      </div>
    </UserPageLayout>
  );
};

export default UserPage;

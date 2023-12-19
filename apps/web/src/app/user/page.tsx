'use client';
import UserSideBar from '@/components/User/Sidebar/UserSideBar';
import UserChat from '@/components/User/chat/UserChat';
import React, { FC, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../global/store';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import AddNewContactModalContent from '@/components/Misc/ModalContent/AddNewContactModal/AddNewContactModalContent';
import Modal from '@/components/Misc/Modal';
import UserPageLayout from './UserPageLayout';
import MainErrorPage from '@/components/Misc/MainErrorPage';
import MainLoadingPage from '@/components/Misc/MainLoadingPage';
import useGetUser from '@/hooks/useGetUser';

type Props = {
  searchParams: Record<string, string> | null | undefined;
};

const UserPage: FC<Props> = ({ searchParams }) => {
  const dispatch = useDispatch();
  const { AddContactModalIsOpen } = useSelector((state: RootState) => state.modalSlice);

  // const user = useUser();
  const { isLoading, isError } = useGetUser();

  if (isLoading) {
    return (
      <Fragment>
        <MainLoadingPage />
      </Fragment>
    );
  }

  // if ((error as AxiosError)?.response?.status === 401) {
  //   return (
  //     <Fragment>
  //       <SessionExpiredErrorPage />
  //     </Fragment>
  //   );
  // }

  if (isError) {
    return (
      <Fragment>
        <MainErrorPage />
      </Fragment>
    );
  }

  return (
    <UserPageLayout>
      <div className="flex h-full">
        <aside className="h-full w-[30%] flex-none flex-shrink-0">
          <UserSideBar />
        </aside>
        <div className="flex-1 flex-grow">
          <UserChat />
        </div>
        <Modal onClose={() => dispatch(toggleAddContactModal())} isOpen={AddContactModalIsOpen} content={<AddNewContactModalContent />} />
      </div>
    </UserPageLayout>
  );
};

export default UserPage;

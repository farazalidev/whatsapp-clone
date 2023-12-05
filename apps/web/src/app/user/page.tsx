'use client';
import Modal from '@/components/Misc/Modal';
import UserSideBar from '@/components/User/Sidebar/UserSideBar';
import UserChat from '@/components/User/UserChat';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../global/store';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import AddNewContactModalContent from '@/components/Misc/ModalContent/AddNewContactModal/AddNewContactModalContent';

type Props = {
  searchParams: Record<string, string> | null | undefined;
};

const UserPage: FC<Props> = ({ searchParams }) => {
  const { AddContactModalIsOpen } = useSelector((state: RootState) => state.modalSlice);
  console.log('🚀 ~ file: page.tsx:15 ~ AddContactModalIsOpen:', AddContactModalIsOpen);

  const dispatch = useDispatch();

  // const { isError, isLoading, data } = useGetUserProfileQuery();

  // useEffect(() => {
  //   if (!data?.is_profile_completed) {
  //     redirect('/auth/completeprofile');
  //   }
  // }, [data?.is_profile_completed]);
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

'use client';
import SearchInput from '@/Atoms/Input/SearchInput';
import React, { Suspense } from 'react';
import SideBarUserCard from '../SideBarUseCard';
import AddNewContactHeading from './AddNewContactHeading';
import { useDispatch } from 'react-redux';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import Typography from '@/Atoms/Typography/Typography';
import useUser from '@/hooks/useUser';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';

const AddNewContactOverlay = () => {
  const dispatch = useDispatch();

  const { data, error, isLoading } = useUser();

  console.log('🚀 ~ file: AddNewContactOverlay.tsx:28 ~ AddNewContactOverlay ~ data:', data);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const handleAddNewContact = () => {
    dispatch(toggleAddContactModal());
  };

  return (
    <div>
      <SearchInput
        icon_src="/icons/search.svg"
        focus_down_icon_src="/icons/backward.svg"
        placeholder="Search Name or Email"
        full_width
        mx-2
        className="mx-2 mt-[1px] mb-[4px]"
      />
      <div>
        <SideBarUserCard name="Add New Contact" avatar_src="/icons/add-contact.svg" show_options={false} onClick={handleAddNewContact} />
        <SideBarUserCard name="Add New Group" avatar_src="/icons/add-group.svg" show_options={false} />
        <AddNewContactHeading heading="Contacts on whatsapp" />

        <Suspense fallback={<FallBackLoadingSpinner />}>
          {data?.contacts && !error ? (
            data.contacts?.map(async (contact) => (
              <SideBarUserCard
                key={contact.Contact.id}
                name={contact.Contact.contact.name}
                avatar_src={contact.profile_blob}
                show_options={false}
              />
            ))
          ) : error ? (
            <Typography className="w-full h-full flex place-items-center justify-center">Error while loading Contacts</Typography>
          ) : (
            <Typography className="w-full h-full flex place-items-center justify-center"> Nothing here...</Typography>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default AddNewContactOverlay;

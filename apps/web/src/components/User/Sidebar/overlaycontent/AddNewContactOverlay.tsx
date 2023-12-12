'use client';
import SearchInput from '@/Atoms/Input/SearchInput';
import React from 'react';
import SideBarUserCard from '../SideBarUseCard';
import AddNewContactHeading from './AddNewContactHeading';
import { useDispatch } from 'react-redux';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import { useGetContactsQuery } from '@/global/apis/UserApi';
import Typography from '@/Atoms/Typography/Typography';

const AddNewContactOverlay = () => {
  const dispatch = useDispatch();

  const { data: contacts, isError: contactsIsError } = useGetContactsQuery();

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

        <div>
          {contacts && !contactsIsError ? (
            contacts?.map(async (contact) => <SideBarUserCard key={contact.id} name={contact.contact_user.name} avatar_src={undefined} />)
          ) : contactsIsError ? (
            <Typography className="w-full h-full flex place-items-center justify-center">Error while loading Contacts</Typography>
          ) : (
            <Typography className="w-full h-full flex place-items-center justify-center"> Nothing here...</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewContactOverlay;

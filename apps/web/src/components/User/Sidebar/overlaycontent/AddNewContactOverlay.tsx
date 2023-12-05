import SearchInput from '@/Atoms/Input/SearchInput';
import React from 'react';
import SideBarUserCard from '../SideBarUseCard';
import AddNewContactHeading from './AddNewContactHeading';
import { useDispatch } from 'react-redux';
import { toggleAddContactModal } from '@/global/features/ModalSlice';

const AddNewContactOverlay = () => {
  const dispatch = useDispatch();

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
      </div>
    </div>
  );
};

export default AddNewContactOverlay;

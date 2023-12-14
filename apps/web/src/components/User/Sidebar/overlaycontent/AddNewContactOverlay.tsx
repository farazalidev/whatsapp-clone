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
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { setSelectedOverlay, setShow } from '@/global/features/SideBarOverlaySlice';
import SideBarOptionCard from '@/Atoms/Cards/SideBarOptionCard';

const AddNewContactOverlay = () => {
  const dispatch = useDispatch();

  const { data, error } = useUser();

  const handleAddNewContact = () => {
    dispatch(toggleAddContactModal());
  };

  const chatStartHandler = async (user_id: string) => {
    // checking if the chat is started
    const isChatStarted = data?.chats.some((chat) => chat.chat_with.user_id === user_id || chat.chat_for.user_id === user_id);

    if (!isChatStarted) {
      /** is the chat is already started
       * Means that is the user have chats with the clicked contact
       * then loads the chat and go to the chat panel
       * **/
      dispatch(setUserChatEntity({ id: user_id, started_from: 'contact' }));
      // closing overlay
      dispatch(setShow(false));
      // resetting overlay
      dispatch(setSelectedOverlay(0));
      return;
    } else {
      const chat = data?.chats.find((chat) => {
        return chat.chat_with.user_id === user_id || chat.chat_for.user_id === user_id;
      });
      dispatch(setUserChatEntity({ id: chat?.id as string, started_from: 'chat' }));
      // closing overlay
      dispatch(setShow(false));
      // resetting overlay
      dispatch(setSelectedOverlay(0));
    }
  };

  return (
    <div>
      <SearchInput
        icon_src="/icons/search.svg"
        focus_down_icon_src="/icons/backward.svg"
        placeholder="Search Name or Email"
        full_width
        mx-2
        className="mx-2 mb-[4px] mt-[1px]"
      />
      <div>
        <SideBarOptionCard title="Add New Contact" icon_path="/icons/add-contact.svg" onClick={handleAddNewContact} />
        <SideBarOptionCard title="Add New Group" icon_path="/icons/add-group.svg" />
        <AddNewContactHeading heading="Contacts on whatsapp" />

        <Suspense fallback={<FallBackLoadingSpinner />}>
          {data?.contacts && !error ? (
            data.contacts?.map((contact) => (
              <SideBarUserCard
                key={contact.id}
                name={contact.contact?.name}
                avatar_path={contact.contact?.profile.pic_path}
                show_options={false}
                onClick={() => chatStartHandler(contact.contact?.user_id)}
              />
            ))
          ) : error ? (
            <Typography className="flex h-full w-full place-items-center justify-center">Error while loading Contacts</Typography>
          ) : (
            <Typography className="flex h-full w-full place-items-center justify-center"> Nothing here...</Typography>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default AddNewContactOverlay;

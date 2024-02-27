'use client';
import SearchInput from '@/Atoms/Input/SearchInput';
import React, { Suspense } from 'react';
import SideBarUserCard from '../SideBarUseCard';
import AddNewContactHeading from './AddNewContactHeading';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAddContactModal } from '@/global/features/ModalSlice';
import Typography from '@/Atoms/Typography/Typography';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { setSelectedOverlay, setShow } from '@/global/features/SideBarOverlaySlice';
import SideBarOptionCard from '@/Atoms/Cards/SideBarOptionCard';
import { fetcher } from '@/utils/fetcher';
import { SuccessResponseType } from '@server/Misc/ResponseType.type';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { RootState, store } from '../../../../global/store';
import { isIamReceiver } from '@/utils/isIamReceiver';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';

const AddNewContactOverlay = () => {
  const dispatch = useDispatch();

  const data = useSelector((state: RootState) => state.UserSlice);

  const handleAddNewContact = () => {
    dispatch(toggleAddContactModal());
  };

  const chatStartHandler = async (contact: ContactEntity) => {

    // getting chat info from the server
    const isChatStarted = await fetcher<SuccessResponseType<UserChatEntity>>(`chat/is-chat/${contact.contact.user_id}`);

    if (!isChatStarted.success) {
      /**
       * If the chat is not started with user
       * then loads user info from the contact
       */

      dispatch(setUserChatEntity({ id: contact.contact.user_id, started_from: 'contact', receiver_id: contact.contact.user_id, chat_receiver: contact.contact }));
      // closing overlay
      dispatch(setShow(false));
      // resetting overlay
      dispatch(setSelectedOverlay(0));
      return;
    } else {
      /** is the chat is already started
       * Means that is the user have chats with the clicked contact
       * then loads the chat and go to the chat panel
       * **/

      const raw_chat = store.getState().messagesSlice.chats_raw.find((chat) => chat.id === isChatStarted.data?.id);
      const { Me } = store.getState().UserSlice;

      const isMeReceiver = isIamReceiver(raw_chat?.chat_with.user_id, Me?.user_id);

      const receiver_user = isMeReceiver ? raw_chat?.chat_for : raw_chat?.chat_with;


      const receiver_id = isIamReceiver(isChatStarted.data?.chat_with.user_id, data.Me?.user_id) ? isChatStarted.data?.chat_for.user_id : isChatStarted.data?.chat_with.user_id
      dispatch(setUserChatEntity({ id: isChatStarted.data?.id as string, started_from: 'chat', receiver_id, chat_receiver: receiver_user }));
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
          {data?.contacts || data.contacts.length === 0 ? (
            data.contacts?.map((contact) => (
              <SideBarUserCard
                key={contact.id}
                name={contact.contact?.name}
                for_other
                user_id={contact.contact.user_id}
                show_options={false}
                onClick={() => chatStartHandler(contact)}
              />
            ))
          ) : (
            <Typography className="flex h-full w-full place-items-center justify-center"> Nothing here...</Typography>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default AddNewContactOverlay;

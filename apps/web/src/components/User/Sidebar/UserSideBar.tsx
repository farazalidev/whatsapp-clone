'use client';
import React, { Suspense } from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '@/global/store';
import SideBarUserCard from './SideBarUserCard';
import Typography from '@/Atoms/Typography/Typography';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { isIamReceiver } from '../../../utils/isIamReceiver';
import { setCurrentUserProfilePreview } from '@/global/features/ProfilePreviewSlice';
import NotificationActivator from './NotificationActivator';

const UserSideBar = () => {
  const dispatch = useDispatch();

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const data = useSelector((state: RootState) => state.UserSlice);

  const { Me } = useSelector((state: RootState) => state.UserSlice)

  const { user_id: currentProfilePreviewUserId } = useSelector((state: RootState) => state.ProfilePreviewSlice)

  const { paginatedChats } = useSelector((state: RootState) => state.messagesSlice)

  const handleChat = async (chat_id: string) => {

    const raw_chat = store.getState().messagesSlice.paginatedChats.data.find(chat => chat.id === chat_id)

    const isMeReceiver = isIamReceiver(raw_chat?.chat_with.user_id, Me?.user_id)

    const receiver_id = isMeReceiver ? raw_chat?.chat_for.user_id : raw_chat?.chat_with.user_id

    const receiver_user = isMeReceiver ? raw_chat?.chat_for : raw_chat?.chat_with

    dispatch(setUserChatEntity({ id: chat_id, started_from: 'chat', receiver_id, chat_receiver: receiver_user }));

    if (receiver_id !== currentProfilePreviewUserId) {
      dispatch(setCurrentUserProfilePreview(undefined))
    }
  };



  return (
    <>
      <div className="dark:bg-whatsapp-dark-primary_bg relative flex h-full flex-col overflow-hidden border-r-[2px] border-r-gray-300 bg-white dark:border-r-gray-600">

      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
        <NotificationActivator />
      <Suspense fallback={<>loading...</>}>
          <div className='overflow-y-auto scrollbar h-full'>
        {paginatedChats.data && data?.Me && paginatedChats.data.length !== 0 ? (
          paginatedChats.data?.map((chat) => {
            return chat.messages && chat?.messages.length > 0 ? (
                <SideBarUserCard
                  key={chat.id}
                chat_id={chat.id}
                  name={isIamReceiver(chat.chat_with?.user_id, data?.Me!.user_id) ? chat.chat_for.name : chat?.chat_with.name}
                messages={chat?.messages}
                  active={chat.id === id}
                  for_other
                  user_id={isIamReceiver(chat.chat_with.user_id, Me?.user_id) ? chat.chat_for.user_id : chat.chat_with.user_id}
                onClick={() => handleChat(chat.id)}
                />
              ) : null;
            })
          ) : (
            <Typography className="flex h-full w-full place-items-center justify-center">No messages yet</Typography>
        )}
          </div>
        </Suspense>
        <EncryptionMessage />
    </div>
    </>
  );
};

export default UserSideBar;

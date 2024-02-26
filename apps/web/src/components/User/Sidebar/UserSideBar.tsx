'use client';
import React, { Suspense } from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import SideBarOverlay from './SideBarOverlay';
import { overlayContent } from './overlaycontent/overlaycontet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '@/global/store';
import SideBarUserCard from './SideBarUseCard';
import Typography from '@/Atoms/Typography/Typography';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { isIamReceiver } from '../../../utils/isIamReceiver';
import { setCurrentUserProfilePreview } from '@/global/features/ProfilePreviewSlice';

const UserSideBar = () => {
  const dispatch = useDispatch();

  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const data = useSelector((state: RootState) => state.UserSlice);

  const { Me } = useSelector((state: RootState) => state.UserSlice)

  const { user_id: currentProfilePreviewUserId } = useSelector((state: RootState) => state.ProfilePreviewSlice)

  const { paginatedChats } = useSelector((state: RootState) => state.messagesSlice)

  const handleChat = async (chat_id: string) => {

    const raw_chat = store.getState().messagesSlice.chats_raw.find(chat => chat.id === chat_id)

    const isMeReceiver = isIamReceiver(raw_chat?.chat_with.user_id, Me?.user_id)

    const receiver_id = isMeReceiver ? raw_chat?.chat_for.user_id : raw_chat?.chat_with.user_id

    const receiver_user = isMeReceiver ? raw_chat?.chat_for : raw_chat?.chat_with

    dispatch(setUserChatEntity({ id: chat_id, started_from: 'chat', receiver_id, chat_receiver: receiver_user }));

    if (receiver_id !== currentProfilePreviewUserId) {
      dispatch(setCurrentUserProfilePreview(undefined))
    }
  };


  return (
    <div className="dark:bg-whatsapp-dark-primary_bg relative flex h-full flex-col overflow-x-hidden border-r-[2px] border-r-gray-300 bg-white dark:border-r-gray-600">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />

      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <Suspense fallback={<>loading...</>}>
        {paginatedChats.data && data?.Me && paginatedChats.data.length !== 0 ? (
          paginatedChats.data?.map((chat) => {
              return (
                    <SideBarUserCard
                      key={chat.id}
                      name={isIamReceiver(chat.chat_with.user_id, data?.Me!.user_id) ? chat.chat_for.name : chat?.chat_with.name}
                      // last_message={getLatestMessage(chat?.messages)?.content}
                  last_message={""}
                  last_message_date={""}
                      active={chat.id === id}
                      for_other
                      user_id={isIamReceiver(chat.chat_with.user_id, Me?.user_id) ? chat.chat_for.user_id : chat.chat_with.user_id}
                  onClick={() => handleChat(chat.id)}
                  unread_message_count={0}
                />
              );
            })
          ) : (
            <Typography className="flex h-full w-full place-items-center justify-center">No messages yet</Typography>
        )}

        <EncryptionMessage />
      </Suspense>
    </div>
  );
};

export default UserSideBar;

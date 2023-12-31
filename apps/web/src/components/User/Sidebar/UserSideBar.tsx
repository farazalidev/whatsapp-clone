'use client';
import React, { Suspense, useEffect } from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import SideBarOverlay from './SideBarOverlay';
import { overlayContent } from './overlaycontent/overlaycontet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import SideBarUserCard from './SideBarUseCard';
import Typography from '@/Atoms/Typography/Typography';
import SidebarChatsSkeleton from '@/skeletons/Components/SidebarChatsSkeleton';
import { getDayOrFormattedDate } from '@/utils/getDateOrFormat';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { isIamReceiver } from '../../../utils/isIamReceiver';
import { getLatestMessage } from '@/utils/getLatestMessage';
import useUser from '@/hooks/useUser';
import useSocket from '@/hooks/useSocket';

const UserSideBar = () => {
  const { socket } = useSocket();

  const dispatch = useDispatch();

  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const { data } = useUser();

  const handleChat = (chat_id: string) => {
    dispatch(setUserChatEntity({ id: chat_id, started_from: 'chat' }));
  };

  useEffect(() => {
    socket.emit('get_unread_messages');
    socket.on(`unread_messages_${data?.Me.user_id}`, (newMessages) => {
      console.log('🚀 ~ file: UserSideBar.tsx:40 ~ socket.on ~ newMessages:', newMessages);
    });

    return () => {
      socket.off(`unread_messages_${data?.Me.user_id}`);
    };
  }, [socket, data?.Me.user_id]);

  return (
    <div className="dark:bg-whatsapp-dark-primary_bg relative flex h-full flex-col overflow-x-hidden border-r-[2px] border-r-gray-300 bg-white dark:border-r-gray-600">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />

      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <Suspense fallback={<SidebarChatsSkeleton />}>
        <div className="dark:bg-whatsapp-dark-primary_bg h-[100%] overflow-y-scroll ">
          {data?.chats && data?.Me && data?.chats?.length !== 0 ? (
            data?.chats?.map((chat) => (
              <SideBarUserCard
                key={chat.id}
                name={isIamReceiver(chat, data?.Me.user_id) ? chat.chat_for.name : chat?.chat_with.name}
                last_message={getLatestMessage(chat?.messages)?.content}
                last_message_date={chat?.messages ? getDayOrFormattedDate(chat?.messages) : undefined}
                active={chat.id === id}
                avatar_path={isIamReceiver(chat, data?.Me.user_id) ? chat.chat_for.profile.pic_path : chat?.chat_with.profile.pic_path}
                onClick={() => handleChat(chat.id)}
              />
            ))
          ) : (
            <Typography className="flex h-full w-full place-items-center justify-center">No messages yet</Typography>
          )}
        </div>

        <EncryptionMessage />
      </Suspense>
    </div>
  );
};

export default UserSideBar;

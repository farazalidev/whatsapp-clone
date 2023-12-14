'use client';
import React, { Suspense } from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import SideBarOverlay from './SideBarOverlay';
import { overlayContent } from './overlaycontent/overlaycontet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import SideBarUserCard from './SideBarUseCard';
import Typography from '@/Atoms/Typography/Typography';
import useUser from '@/hooks/useUser';
import SidebarChatsSkeleton from '@/skeletons/Components/SidebarChatsSkeleton';
import { getDayOrFormattedDate } from '@/utils/getDateOrFormat';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { isIamReceiver } from '../../../utils/isIamReciever';
import { getLatestMessage } from '@/utils/getLatestMessage';

const UserSideBar = () => {
  const dispatch = useDispatch();

  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  const { data } = useUser();
  console.log('🚀 ~ file: UserSideBar.tsx:19 ~ UserSideBar ~ data:', data);

  const handleChat = (chat_id: string) => {
    dispatch(setUserChatEntity({ id: chat_id, started_from: 'chat' }));
  };

  const receiver = isIamReceiver(data);

  return (
    <div className="dark:bg-whatsapp-dark-primary_bg relative flex h-full flex-col overflow-x-hidden border-r-[2px] border-r-gray-300 bg-white dark:border-r-gray-600">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />

      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <Suspense fallback={<SidebarChatsSkeleton />}>
        <div className="dark:bg-whatsapp-dark-primary_bg h-[100%] overflow-y-scroll ">
          {data?.chats && data?.chats.length !== 0 ? (
            data.chats?.map((chat) => (
              <SideBarUserCard
                key={chat.id}
                name={receiver ? chat.chat_for.name : chat?.chat_with.name}
                last_message={getLatestMessage(chat?.messages)?.content}
                last_message_date={getDayOrFormattedDate(chat.messages[chat.messages.length - 1].sended_at)}
                avatar_path={receiver ? chat.chat_for.profile.pic_path : chat?.chat_with.profile.pic_path}
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

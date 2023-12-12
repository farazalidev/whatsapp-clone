'use client';
import React, { useState } from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import SideBarOverlay from './SideBarOverlay';
import { overlayContent } from './overlaycontent/overlaycontet';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import SideBarUserCard from './SideBarUseCard';
import { useGetChatsQuery } from '@/global/apis/chatApi';
import Typography from '@/Atoms/Typography/Typography';

const UserSideBar = () => {
  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  const { data: userChatsData } = useGetChatsQuery();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_chat_id, setChat_id] = useState<string | null>(null);

  const handleUserChatEntity = (chat_id: string) => {
    setChat_id(chat_id);
  };

  return (
    <div className="relative flex flex-col dark:bg-whatsapp-dark-primary_bg h-full overflow-x-hidden border-r-[2px] border-r-gray-300 dark:border-r-gray-600">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />

      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <div className="h-[100%] overflow-y-scroll dark:bg-whatsapp-dark-primary_bg ">
        {userChatsData && userChatsData.length !== 0 ? (
          userChatsData?.map((chat) => (
            <SideBarUserCard
              key={chat.id}
              name={chat?.user.name}
              last_message="Hello"
              last_message_date="Saturday"
              onClick={() => handleUserChatEntity(chat.id)}
            />
          ))
        ) : (
          <Typography className="flex w-full h-full justify-center place-items-center">No messages yet</Typography>
        )}

        <EncryptionMessage />
      </div>
    </div>
  );
};

export default UserSideBar;

import React from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import SideBarOverlay from './SideBarOverlay';
import { overlayContent } from './overlaycontent/overlaycontet';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import SideBarUserCard from './SideBarUseCard';
import { useGetChatsQuery } from '@/global/apis/chatApi';
import { useGetProfileQuery } from '@/global/apis/UserApi';

const UserSideBar = () => {
  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  const { data: profileData, isLoading } = useGetProfileQuery();
  const { data } = useGetChatsQuery();

  return (
    <div className="relative flex flex-col dark:bg-whatsapp-dark-primary_bg h-full overflow-x-hidden border-r-[2px] border-r-gray-300 dark:border-r-gray-600">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />

      <div>
        <SideBarHeader pic_path={profileData?.pic_path as string} />
        <SideBarSearch />
      </div>
      {data?.length === 0 ? (
        <div className="w-full h-full  flex place-items-center justify-center text-whatsapp-light-text dark:text-whatsapp-dark-text dark:bg-whatsapp-dark-primary_bg ">
          No messaged yet
        </div>
      ) : (
        <div className="h-[100%] overflow-y-scroll dark:bg-whatsapp-dark-primary_bg ">
          {data?.map((chat, index) => (
            <SideBarUserCard key={index} name={chat.user.name} last_message="Hello" last_message_date="Saturday" />
          ))}
          <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />

          <EncryptionMessage />
        </div>
      )}
    </div>
  );
};

export default UserSideBar;

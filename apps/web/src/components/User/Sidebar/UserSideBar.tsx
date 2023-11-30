import React from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import SideBarUseCard from './SideBarUseCard';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';

const UserSideBar = () => {
  return (
    <div className="flex flex-col dark:bg-whatsapp-dark-primary_bg h-full">
      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <div className="h-[100%] overflow-y-scroll dark:bg-whatsapp-dark-primary_bg ">
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <SideBarUseCard />
        <EncryptionMessage />
      </div>
    </div>
  );
};

export default UserSideBar;

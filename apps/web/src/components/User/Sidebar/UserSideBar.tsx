import React from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import SideBarOverlay from './SideBarOverlay';
import { overlayContent } from './overlaycontent/overlaycontet';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import SideBarUserCard from './SideBarUseCard';

const UserSideBar = () => {
  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  return (
    <div className="relative flex flex-col dark:bg-whatsapp-dark-primary_bg h-full overflow-x-hidden">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />
      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <div className="h-[100%] overflow-y-scroll dark:bg-whatsapp-dark-primary_bg ">
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />
        <SideBarUserCard name="Faraz Ali" last_message="Hello" last_message_date="Saturday" />

        <EncryptionMessage />
      </div>
    </div>
  );
};

export default UserSideBar;

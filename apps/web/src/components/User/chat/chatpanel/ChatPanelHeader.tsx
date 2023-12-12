import React, { FC } from 'react';
import Avatar from '../../Avatar';
import OptionIcon from '../../Sidebar/OptionIcon';

interface ChatPanelHeaderProps {
  avatar_scr?: string;
  header_name: string;
}

const ChatPanelHeader: FC<ChatPanelHeaderProps> = ({ avatar_scr, header_name = 'Name' }) => {
  return (
    <div className="w-full inline-flex justify-between place-items-center px-4 py-2  bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg border-l-[1px] border-l-gray-100 dark:border-l-gray-800">
      <div className="flex gap-4 place-items-center">
        <Avatar avatar_src={avatar_scr ? avatar_scr : undefined} />
        <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{header_name}</span>
      </div>
      <div>
        <span className="flex place-items-center gap-4">
          <OptionIcon src="/icons/search.svg" tooltip="search" height={35} width={35} className="text-red-100 " />
          <OptionIcon src="/icons/option.svg" tooltip="search" height={30} width={30} />
        </span>
      </div>
    </div>
  );
};

export default ChatPanelHeader;

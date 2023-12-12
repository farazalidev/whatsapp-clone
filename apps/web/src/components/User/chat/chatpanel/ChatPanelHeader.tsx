import React, { FC } from 'react';
import Avatar, { AvatarProps } from '../../Avatar';
import OptionIcon from '../../Sidebar/OptionIcon';

interface ChatPanelHeaderProps extends AvatarProps {
  header_name: string;
}

const ChatPanelHeader: FC<ChatPanelHeaderProps> = ({ header_name = 'Name', ...props }) => {
  return (
    <div className="w-full inline-flex justify-between place-items-center px-4 py-2  bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg border-l-[1px] border-l-gray-100 dark:border-l-gray-800">
      <div className="flex gap-4 place-items-center">
        <Avatar {...props} />
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

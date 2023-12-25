import React, { FC, useEffect, useMemo, useState } from 'react';
import Avatar, { AvatarProps } from '../../Avatar';
import OptionIcon from '../../Sidebar/OptionIcon';
import Typography from '@/Atoms/Typography/Typography';
import { createSocket } from '@/utils/createSocket';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';

interface ChatPanelHeaderProps extends AvatarProps {
  header_name: string;
}

const ChatPanelHeader: FC<ChatPanelHeaderProps> = ({ header_name = 'Name', ...props }) => {
  const { socket } = useMemo(() => createSocket(), []);

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const [onlineUsers, setOnlineUsers] = useState<{ user_id: string }[]>([]);

  const user_id = useSelector((state: RootState) => state.UserSlice.Me?.user_id);

  useEffect(() => {
    if (socket) {
      socket.emit('get-online', { chat_id: id });
      socket.on(`online-users-${id}`, (users: { user_id: string }[]) => {
        setOnlineUsers(users);
      });
    }
  }, [socket, id, user_id]);

  return (
    <div className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg inline-flex w-full place-items-center justify-between  border-l-[1px] border-l-gray-100 px-4 py-2 dark:border-l-gray-800">
      <div className="flex place-items-center gap-4">
        <Avatar {...props} height={40} width={40} />
        <div>
          <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{header_name}</span>
          <Typography level={1}>{onlineUsers.length > 1 ? 'online' : null}</Typography>
        </div>
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

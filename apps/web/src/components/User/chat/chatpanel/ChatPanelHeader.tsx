import React, { FC, useEffect, useState } from 'react';
import Avatar, { AvatarProps } from '../../Avatar';
import OptionIcon from '../../Sidebar/OptionIcon';
import Typography from '@/Atoms/Typography/Typography';
import useSocket from '@/hooks/useSocket';
import useGetUserOnlineStatus from '@/hooks/useGetUserOnlineStatus';

interface ChatPanelHeaderProps extends AvatarProps {
  header_name: string;
  receiver_id: string | undefined;
  chat_id: string | undefined;
}

const ChatPanelHeader: FC<ChatPanelHeaderProps> = ({ header_name = 'Name', receiver_id, chat_id, ...props }) => {
  const { status } = useGetUserOnlineStatus({ user_id: receiver_id });

  const [isTyping, setIsTyping] = useState(false);

  const [isOnline, setIsOnline] = useState(false);

  const { socket } = useSocket();

  useEffect(() => {
    if (status) {
      return setIsOnline(true);
    }
    setIsOnline(false);
  }, [status, receiver_id]);

  useEffect(() => {
    socket.on(`typing_${chat_id}_${receiver_id}`, () => {
      setIsTyping(true);
    });
    socket.on(`stop_typing_${chat_id}_${receiver_id}`, () => {
      setIsTyping(false);
    });

    return () => {
      socket.off(`typing_${chat_id}_${receiver_id}`);
      socket.off(`stop_typing_${chat_id}_${receiver_id}`);
    };
  }, [socket, receiver_id, chat_id]);

  return (
    <div className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg inline-flex w-full place-items-center justify-between  border-l-[1px] border-l-gray-100 px-4 py-2 dark:border-l-gray-800">
      <div className="flex place-items-center gap-4">
        <Avatar {...props} height={40} width={40} />
        <div>
          <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{header_name}</span>
          {isTyping ? <Typography level={1}>Typing...</Typography> : isOnline ? <Typography level={1}>Online</Typography> : null}
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

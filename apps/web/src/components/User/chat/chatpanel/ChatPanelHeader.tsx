import React, { FC, useCallback, useEffect, useState } from 'react';
import Avatar, { AvatarProps } from '../../Avatar';
import OptionIcon from '../../Sidebar/OptionIcon';
import Typography from '@/Atoms/Typography/Typography';
import useSocket from '@/hooks/useSocket';
import useGetUserOnlineStatus from '@/hooks/useGetUserOnlineStatus';
import { useDispatch, } from 'react-redux';
import ChatPanelHeaderWrapper from './ChatPanelHeaderWrapper';
import { setCurrentUserProfilePreview } from '@/global/features/ProfilePreviewSlice';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { openCallPanel } from '@/global/features/callSlice';
import { CallMode } from '../../../../../../../shared/types/call.types';

interface ChatPanelHeaderProps extends AvatarProps {
  receiver: UserEntity | undefined
  chat_id: string | undefined;
}

const ChatPanelHeader: FC<ChatPanelHeaderProps> = ({ receiver, chat_id, ...props }) => {
  const dispatch = useDispatch()

  const { status } = useGetUserOnlineStatus({ user_id: receiver?.user_id });

  const [isTyping, setIsTyping] = useState(false);

  const [isOnline, setIsOnline] = useState(false);

  const { socket } = useSocket();

  useEffect(() => {
    if (status) {
      return setIsOnline(true);
    }
    setIsOnline(false);
  }, [status, receiver?.user_id]);

  useEffect(() => {
    socket.on(`typing_${chat_id}_${receiver?.user_id}`, () => {
      setIsTyping(true);
    });
    socket.on(`stop_typing_${chat_id}_${receiver?.user_id}`, () => {
      setIsTyping(false);
    });

    return () => {
      socket.off(`typing_${chat_id}_${receiver?.user_id}`);
      socket.off(`stop_typing_${chat_id}_${receiver?.user_id}`);
    };
  }, [socket, receiver?.user_id, chat_id]);

  const handleProfilePreview = () => {

    dispatch(setCurrentUserProfilePreview(receiver?.user_id))
  }

  const handleCall = useCallback(async (type: CallMode) => {
    if (receiver) {
      dispatch(openCallPanel({ callReceiver: receiver, callType: "offer", callMode: type }))
    }
  }, [dispatch, receiver])

  return (
    <ChatPanelHeaderWrapper className='flex place-items-center justify-between'>
      <div className="flex place-items-center gap-4 cursor-pointer" onClick={handleProfilePreview}>
        <Avatar {...props} user_id={receiver?.user_id} height={40} width={40} />
        <div>
          <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{receiver?.name || "Name"}</span>
          {isTyping ? <Typography level={1}>Typing...</Typography> : isOnline ? <Typography level={1}>Online</Typography> : null}
        </div>
      </div>
      <div>
        <span className="flex place-items-center gap-4">
          <OptionIcon src="/icons/video-call.svg" tooltip="video call" height={30} width={30} onClick={() => handleCall("video")} />
          <OptionIcon src="/icons/voice-call.svg" tooltip="voice call" height={30} width={30} onClick={() => handleCall("voice")} />
          <OptionIcon src="/icons/search.svg" tooltip="search" height={35} width={35} className="text-red-100 " />
          <OptionIcon src="/icons/option.svg" tooltip="search" height={30} width={30} />
        </span>
      </div>
    </ChatPanelHeaderWrapper>
  );
};

export default ChatPanelHeader;

import OptionIcon from '@/components/User/Sidebar/OptionIcon'
import dayjs from 'dayjs'
import React, { FC } from 'react'
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import useColorScheme from '@/hooks/useColorScheme';



interface IMediaMessageStatus {
  message: MessageEntity | undefined;
  isFromMe: boolean | undefined;
}

const MediaMessageStatus: FC<IMediaMessageStatus> = ({ isFromMe, message }) => {
  const theme = useColorScheme()
  return isFromMe ? (
    <span className={`flex place-items-center justify-evenly gap-1 pl-1  absolute bottom-0 right-0 mt-4'`}>
      <span className="mt-1 flex text-[10px] text-white text-opacity-70 z-20">{message?.sended_at ? dayjs(message.sended_at).format('hh:mm A') : ''}</span>
      <span className="flex place-items-center px-1 py-[2px] z-20">
        {message?.seen_at ? (
          // Render the icon for seen messages
          <OptionIcon src="/icons/seen.svg" height={18} width={18} />
        ) : message?.received_at ? (
          // Render the icon for received messages
          <OptionIcon src="/icons/sended.svg" height={18} width={18} />
        ) : message?.sended ? (
          // Render the icon for sent messages
              // Render the icon for sent messages
              theme === 'dark' ? (
                <OptionIcon src="/icons/msg-check.svg" height={15} width={15} />
              ) : (
                <OptionIcon src="/icons/msg-check-light.svg" height={15} width={15} />
              )
        ) : (
          // Render the loading icon for other cases
          <OptionIcon src="/icons/status-time.svg" height={15} width={15} />
        )}
      </span>
    </span>
  ) : null
}

export default MediaMessageStatus

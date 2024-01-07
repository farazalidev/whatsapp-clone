import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import dayjs from 'dayjs';

interface IMessageBubble {
  isFromMe: boolean | undefined;
  message: MessageEntity | undefined;
}

const MessageBubble: FC<IMessageBubble> = ({ isFromMe, message }) => {
  const [messageLines, setMessageLines] = useState<number>(1);

  const messageRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    if (messageRef.current) {
      const lines = Math.ceil(messageRef.current.clientHeight / parseFloat(getComputedStyle(messageRef.current).lineHeight || '1.2em'));
      setMessageLines(lines);
    }
  }, [message]);

  return (
    <span
      ref={messageRef}
      className={`relative flex h-fit w-fit max-w-[80%] justify-between rounded-md px-2 py-1 lg:max-w-[40%] ${
        isFromMe
          ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text '
          : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
      }`}
    >
      <span style={{ whiteSpace: 'pre-wrap' }} className={`w-fit max-w-full break-words  ${messageLines > 2 ? 'pb-2' : ''}`}>
        {message?.content}
      </span>
      {isFromMe ? (
        <span className={`flex place-items-center justify-evenly gap-1 pl-1  ${messageLines > 2 ? 'absolute bottom-0 right-0 mt-4' : 'place-self-end'}`}>
          <span className="flex place-self-start text-[10px] text-white text-opacity-70">
            {message?.sended_at ? dayjs(message.sended_at).format('hh:mm A') : ''}
          </span>
          <span>
            {message?.seen_at ? (
              // Render the icon for seen messages
              <OptionIcon src="/icons/seen.svg" height={18} width={18} />
            ) : message?.received_at ? (
              // Render the icon for received messages
              <OptionIcon src="/icons/sended.svg" height={18} width={18} />
            ) : message?.sended_at ? (
              // Render the icon for sent messages
              <OptionIcon src="/icons/msg-check.svg" height={18} width={18} />
            ) : (
              // Render the loading icon for other cases
              <OptionIcon src="/icons/status-time.svg" height={18} width={18} />
            )}
          </span>
        </span>
      ) : null}
    </span>
  );
};

export default MessageBubble;

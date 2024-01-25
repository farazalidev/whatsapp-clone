import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import dayjs from 'dayjs';
import Image from 'next/image';
import { mainDb } from '@/utils/mainIndexedDB';
import { fetcher } from '@/utils/fetcher';
import VideoWithPlaceholder from '@/components/Misc/VideoWithPlaceholder';
import { MessageBubbleImagePreview } from './MessageBubbleImagePreview';
import { MessageBubbleVideoPreview } from './MessageBubbleVideoPreview';

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
    <>
      {message?.messageType === "image" || message?.messageType === "svg" ?
        <MessageBubbleImagePreview isFromMe={isFromMe} message={message} key={message?.id} messageLines={messageLines} />
        : message?.messageType === "video" ? <MessageBubbleVideoPreview isFromMe={isFromMe} message={message} key={message?.id} messageLines={messageLines} /> : null}

    </>
    // <span
    //   ref={messageRef}
    //   className={`relative flex h-fit w-fit max-w-[80%] justify-between rounded-md px-2 py-1 lg:max-w-[40%] ${isFromMe
    //     ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text '
    //     : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
    //     }`}
    // >
    //   {message?.messageType === 'image' ? <MessageBubbleImagePreview message={message} isFromMe={isFromMe} /> : message?.messageType === "video" ? <MessageBubbleVideoPreview message={message} isFromMe={isFromMe} /> : message?.messageType === "svg" ? <MessageBubbleSvgPreview message={message} isFromMe={isFromMe} /> : message?.messageType === "others" ? <MessageBubbleOtherFilesPreview message={message} isFromMe={isFromMe} /> : <TextMessagePreview message={message} isFromMe={isFromMe} messageLines={messageLines} />}

    //   {isFromMe ? (
    //     <span className={`flex place-items-center justify-evenly gap-1 pl-1  ${messageLines > 2 ? 'absolute bottom-0 right-0 mt-4' : 'place-self-end'}`}>
    //       <span className="mt-1 flex text-[10px] text-white text-opacity-70">{message?.sended_at ? dayjs(message.sended_at).format('hh:mm A') : ''}</span>
    //       <span className="flex place-items-center ">
    //         {message?.seen_at ? (
    //           // Render the icon for seen messages
    //           <OptionIcon src="/icons/seen.svg" height={18} width={18} />
    //         ) : message?.received_at ? (
    //           // Render the icon for received messages
    //           <OptionIcon src="/icons/sended.svg" height={18} width={18} />
    //         ) : message?.sended ? (
    //           // Render the icon for sent messages
    //           <OptionIcon src="/icons/msg-check.svg" height={18} width={18} />
    //         ) : (
    //           // Render the loading icon for other cases
    //           <OptionIcon src="/icons/status-time.svg" height={15} width={15} />
    //         )}
    //       </span>
    //     </span>
    //   ) : null}
    // </span>
  );
};

export default MessageBubble;


interface IMessageBubblePreview {
  message: MessageEntity | undefined
  isFromMe: boolean | undefined
  messageLines?: number
}












const MessageBubbleOtherFilesPreview: FC<IMessageBubblePreview> = ({ message, messageLines }) => {
  return (
    <div>
      other Files
    </div>
  )
}



const TextMessagePreview: FC<IMessageBubblePreview> = ({ message, messageLines }) => {
  return (
    <span style={{ whiteSpace: 'pre-wrap' }} className={`w-fit max-w-full break-words  ${messageLines && messageLines > 2 ? 'pb-2' : ''}`}>
      {message?.content}
    </span>
  )
}


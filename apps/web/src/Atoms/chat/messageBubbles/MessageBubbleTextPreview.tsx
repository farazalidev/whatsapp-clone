import { IMessageBubblePreview } from '@/Atoms/types/messageBubble.types';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import MessageStatus from './MessageStatus';
import { clampString } from '@/utils/clamp';

export const TextMessagePreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {

  const words = 320
  const [readMoreState, setReadMoreState] = useState<{ shouldShow: boolean; readMore: boolean }>({
    readMore: false,
    shouldShow: (message?.content?.length as number) > words ? true : false,
  });

  const handleReadMore = () => {
    setReadMoreState((prev) => {
      return { readMore: !prev.readMore, shouldShow: prev.shouldShow };
    });
  };

  return (
    <span
      className={`relative flex h-fit w-fit max-w-[80%] justify-between rounded-md px-2 py-1 lg:max-w-[40%] ${isFromMe
        ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text '
        : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
        }`}
    >
      <div style={{ whiteSpace: 'pre-wrap' }} className={`w-fit max-w-full text-balance break-words pr-1`}>
        {message?.content ? (
          readMoreState.shouldShow ? (
            readMoreState.readMore ? (
              <span>
                <span>{message.content}</span>
                <span className="text-sky-500 cursor-pointer" onClick={handleReadMore}>show less</span>
              </span>
            ) : (
              <span>
                {clampString(message?.content, words)}{' '}
                <span className="text-sky-500 cursor-pointer pl-1" onClick={handleReadMore}>
                  read more
                </span>
              </span>
            )
          ) : (
            message?.content
          )
        ) : null}
        {isFromMe ? <span className="invisible">{' ' + '_______'}</span> : null}
      </div>
      {isFromMe ? (
        <span className={`absolute bottom-[5px] right-1 flex w-[65px] flex-row place-items-center justify-center gap-1`}>
          <span className="mt-1 flex whitespace-nowrap text-[10px] text-whatsapp-light-text dark:text-white dark:text-opacity-70 text-opacity-70">
            {message?.sended_at ? dayjs(message.sended_at).format('hh:mm A') : ''}
          </span>
          <MessageStatus message={message} />
        </span>
      ) : null}
    </span>
  );
};

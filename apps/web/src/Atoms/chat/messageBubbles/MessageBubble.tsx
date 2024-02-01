import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { MessageBubbleImagePreview } from './MessageBubbleImagePreview';
import { MessageBubbleVideoPreview } from './MessageBubbleVideoPreview';
import { TextMessagePreview } from './MessageBubbleTextPreview';
import { MessageBubbleOtherFilesPreview } from './MessageBullbleOtherPreview';

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
        : message?.messageType === "video" ? <MessageBubbleVideoPreview isFromMe={isFromMe} message={message} key={message?.id} messageLines={messageLines} /> : message?.messageType === "text" ? <TextMessagePreview isFromMe={isFromMe} message={message} messageLines={messageLines} /> : message?.messageType === "others" ? <MessageBubbleOtherFilesPreview isFromMe={isFromMe} message={message} key={message.id} messageLines={messageLines} /> : null}

    </>
  );
};

export default MessageBubble;














import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { MessageBubbleImagePreview } from './MessageBubbleImagePreview';
import { MessageBubbleVideoPreview } from './MessageBubbleVideoPreview';
import { TextMessagePreview } from './MessageBubbleTextPreview';
import { MessageBubbleOtherFilesPreview } from './MessageBullbleOtherPreview';
import { IChatSlice } from '@/global/features/ChatSlice';
import { ISocket_Client } from '@/utils/createSocket';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import MessageBubbleVoicePreview from './MessageBubbleVoicePreview';

export interface IMessageBubble {
  isFromMe?: boolean | undefined;
  message: MessageEntity | undefined;
  receiver_id: string | undefined;
  Me: UserEntity | undefined | null;
  ChatSlice: IChatSlice | undefined;
  socket: ISocket_Client | undefined;
}

const MessageBubble: FC<IMessageBubble> = ({ isFromMe, message, ...props }) => {
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
      {message?.messageType === 'image' || message?.messageType === 'svg' ? (
        <MessageBubbleImagePreview isFromMe={isFromMe} message={message} key={message?.id} messageLines={messageLines} {...props} />
      ) : message?.messageType === 'video' ? (
        <MessageBubbleVideoPreview isFromMe={isFromMe} message={message} key={message?.id} messageLines={messageLines} {...props} />
      ) : message?.messageType === 'text' ? (
        <TextMessagePreview isFromMe={isFromMe} message={message} messageLines={messageLines} {...props} />
      ) : message?.messageType === 'audio' ? (
        <MessageBubbleVoicePreview isFromMe={isFromMe} message={message} key={message?.id} messageLines={messageLines} {...props} />
      ) : message?.messageType === 'others' ? (
        <MessageBubbleOtherFilesPreview isFromMe={isFromMe} message={message} key={message.id} messageLines={messageLines} {...props} />
      ) : null}
    </>
  );
};

export default MessageBubble;

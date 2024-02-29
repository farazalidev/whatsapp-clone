import React, { FC } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { MessageBubbleImagePreview } from './MessageBubbleImagePreview';
import { MessageBubbleVideoPreview } from './MessageBubbleVideoPreview';
import { TextMessagePreview } from './MessageBubbleTextPreview';
import { MessageBubbleOtherFilesPreview } from './MessageBubbleOtherFilesPreview';
import { IChatSlice } from '@/global/features/ChatSlice';
import { ISocket_Client } from '@/utils/createSocket';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import MessageBubbleVoicePreview from './MessageBubbleVoicePreview';
import { MessageBubblePdfPreview } from './MessageBubblePdfPreview';

export interface IMessageBubble {
  isFromMe?: boolean | undefined;
  message: MessageEntity | undefined;
  receiver_id: string | undefined;
  Me: UserEntity | undefined | null;
  ChatSlice: IChatSlice | undefined;
  socket: ISocket_Client | undefined;
}

const MessageBubble: FC<IMessageBubble> = ({ isFromMe, message, ...props }) => {
  return (
    <>
      {message?.messageType === 'image' || message?.messageType === 'svg' ? (
        <MessageBubbleImagePreview isFromMe={isFromMe} message={message} key={message?.id} {...props} />
      ) : message?.messageType === 'video' ? (
          <MessageBubbleVideoPreview isFromMe={isFromMe} message={message} key={message?.id} {...props} />
      ) : message?.messageType === 'text' ? (
            <TextMessagePreview isFromMe={isFromMe} message={message} {...props} />
      ) : message?.messageType === 'audio' ? (
              <MessageBubbleVoicePreview isFromMe={isFromMe} message={message} key={message?.id} {...props} />
            ) : message?.messageType === 'pdf' ? (
                <MessageBubblePdfPreview isFromMe={isFromMe} message={message} key={message.id} {...props} />
      ) : message?.messageType === 'others' ? (
                  <MessageBubbleOtherFilesPreview isFromMe={isFromMe} message={message} key={message.id} {...props} />
      ) : null}
    </>
  );
};

export default MessageBubble;

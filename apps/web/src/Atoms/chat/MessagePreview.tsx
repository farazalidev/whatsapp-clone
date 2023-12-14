import React, { FC } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import MessageBubble from './MessageBubble';

interface IMessagePreview extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: MessageEntity;
  isFromMe?: boolean;
}

const MessagePreview: FC<IMessagePreview> = ({ message, isFromMe }) => {
  return (
    <>
      <div className="relative flex place-items-center p-4">
        <MessageBubble isFromMe={isFromMe as boolean} message={message?.content} />
      </div>
    </>
  );
};

export default MessagePreview;

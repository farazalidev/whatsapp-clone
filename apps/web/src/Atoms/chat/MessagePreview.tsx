import React, { FC, useMemo } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import MessageBubble from './messageBubbles/MessageBubble';

interface IMessagePreview extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: MessageEntity;
  isFromMe?: boolean;
}

const MessagePreview: FC<IMessagePreview> = ({ message, isFromMe }) => {
  const MessageBubbleMemo = useMemo(() => {
    return <MessageBubble isFromMe={isFromMe} message={message} />;
  }, [isFromMe, message]);

  return (
    <>
      <div className={`flex flex-col  justify-center  ${isFromMe ? 'items-end' : 'items-start'}`}>{MessageBubbleMemo}</div>
    </>
  );
};

export default MessagePreview;

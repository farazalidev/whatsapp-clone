import React, { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import MessageBubble, { IMessageBubble } from './messageBubbles/MessageBubble';

interface IMessagePreview extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, IMessageBubble {
  message: MessageEntity;
  isFromMe?: boolean;
}

const MessagePreview: ForwardRefRenderFunction<HTMLDivElement, IMessagePreview> = ({ message, isFromMe, ChatSlice, receiver_id, socket, Me }, ref) => {
  const MessageBubbleMemo = useMemo(() => {
    return <MessageBubble isFromMe={isFromMe} message={message} ChatSlice={ChatSlice} receiver_id={receiver_id} socket={socket} Me={Me} />;
  }, [ChatSlice, Me, isFromMe, message, receiver_id, socket]);

  return (
    <>
      <div ref={ref} className={`flex flex-col  justify-center  ${isFromMe ? 'items-end' : 'items-start'}`}>{MessageBubbleMemo}</div>
    </>
  );
};

export default forwardRef(MessagePreview);

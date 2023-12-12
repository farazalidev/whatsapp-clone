import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import React, { FC } from 'react';
import {} from 'class-transformer';

interface MessageType extends MessageEntity {}

interface ChatHandlerProps {
  messages?: MessageType[];
}

const ChatHandler: FC<ChatHandlerProps> = ({ messages }) => {
  return <div className="w-full h-full">{messages ? messages.map((message) => <div key={message.id}>{message.content}</div>) : null}</div>;
};

export default ChatHandler;

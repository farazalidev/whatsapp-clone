import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import React, { FC } from 'react';
import {} from 'class-transformer';
import MessagePreview from '@/Atoms/chat/MessagePreview';
import useUser from '@/hooks/useUser';

interface MessageType extends MessageEntity {}

interface ChatHandlerProps {
  messages?: MessageType[];
}

const ChatHandler: FC<ChatHandlerProps> = ({ messages }) => {
  const user = useUser();

  return (
    <>
      {/* {isInMyContacts ? null : <NewContactActions />} */}
      <div className="relative flex h-full w-full flex-col gap-4 overflow-y-scroll px-4 py-2">
        {messages
          ? messages
              .sort((a, b) => {
                const dateA = new Date(a.sended_at).getTime();
                const dateB = new Date(b.sended_at).getTime();
                return dateA - dateB;
              })
              .map((message) => (
                <MessagePreview isFromMe={user.data?.Me.user_id === message?.from?.user_id} message={message} key={message.id} />
              ))
          : null}
      </div>
    </>
  );
};

export default ChatHandler;

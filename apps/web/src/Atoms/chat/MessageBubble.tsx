import React, { FC } from 'react';

interface IMessageBubble {
  isFromMe: boolean | undefined;
  message: string | undefined;
}

const MessageBubble: FC<IMessageBubble> = ({ isFromMe, message }) => {
  return (
    <div>
      <span
        className={`absolute h-fit  max-w-[40%] overflow-y-scroll rounded-md border-2 border-red-500 px-2 py-1 ${
          isFromMe
            ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text right-0 '
            : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text left-0'
        }`}
      >
        {message}
      </span>
    </div>
  );
};

export default MessageBubble;

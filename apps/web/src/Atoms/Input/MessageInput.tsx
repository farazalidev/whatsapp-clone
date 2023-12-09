import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import React, { FC } from 'react';

interface MessageInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const MessageInput: FC<MessageInputProps> = ({ ...props }) => {
  return (
    <div className="relative flex place-items-center">
      <input
        className="w-full rounded-lg bg-white dark:bg-whatsapp-misc-message_input outline-none dark:text-whatsapp-dark-text pr-[12px] pl-12 placeholder:p-1 py-[9px] my-[5px]"
        placeholder="Type a message"
        {...props}
      />
      <OptionIcon src="/icons/smiley.svg" tooltip="" className="absolute left-2 z-10 top-[14px]" />
    </div>
  );
};

export default MessageInput;

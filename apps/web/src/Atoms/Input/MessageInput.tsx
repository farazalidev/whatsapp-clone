import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../global/store';

interface MessageInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const MessageInput: FC<MessageInputProps> = ({ ...props }) => {
  const { message_input_loading } = useSelector((state: RootState) => state.LoadingSlice);
  return (
    <div className="relative flex place-items-center">
      <input
        className="dark:bg-whatsapp-misc-message_input dark:text-whatsapp-dark-text my-[5px] w-full rounded-lg bg-white py-[9px] pl-12 pr-[12px] outline-none placeholder:p-1"
        placeholder="Type a message"
        disabled={message_input_loading}
        {...props}
      />
      <OptionIcon src="/icons/smiley.svg" tooltip="" className="absolute left-2 top-[14px] z-10" />
    </div>
  );
};

export default MessageInput;

import React, { ChangeEvent, FormEvent, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import MessageInput from '@/Atoms/Input/MessageInput';

const MessageSender = () => {
  const [messageValue, setMessageValue] = useState<string>();

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageValue(e.target.value);
  };
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    setMessageValue('');
  };

  return (
    <form
      onSubmit={(e) => handleSendMessage(e)}
      className="flex place-items-center justify-between gap-[16px] px-[20px] py-[5px] bg-whatsapp-light-sender_bg dark:bg-whatsapp-dark-sender_bg"
    >
      <span>
        <OptionIcon src="/icons/attach-menu-plus.svg" tooltip="attach" />
      </span>
      <span className="w-full">
        <MessageInput onChange={handleMessageChange} value={messageValue} />
      </span>
      <span>
        {messageValue ? (
          <>
            <button type="submit">
              <OptionIcon src="/icons/send.svg" tooltip="" />
            </button>
          </>
        ) : (
          <>
            <OptionIcon src="/icons/mic.svg" tooltip="" />
          </>
        )}
      </span>
    </form>
  );
};

export default MessageSender;

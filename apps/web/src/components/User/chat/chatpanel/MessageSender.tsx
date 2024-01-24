import React, { ChangeEvent, FormEvent, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import MessageInput from '@/Atoms/Input/MessageInput';
import { useSelector } from 'react-redux';
import useSocket from '@/hooks/useSocket';
import { RootState } from '../../../../global/store';
import Attachments from './Attachments';
import { sendMessageFn } from '@/utils/sendMessageFn';
import { toast } from 'sonner';

const MessageSender = ({ receiver_id, chat_id }: { receiver_id: string; chat_id: string | undefined }) => {
  const { message_input_loading } = useSelector((state: RootState) => state.LoadingSlice);

  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { Me } = useSelector((state: RootState) => state.UserSlice);

  const { socket } = useSocket();

  const [typing, setTyping] = useState(false);

  const [messageValue, setMessageValue] = useState<string>();


  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageValue(e.target.value);
    if (!typing) {
      setTyping(true);

      socket.emit('typing', { chat_id: chat_id as string, user_id: Me?.user_id as string });
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit(`stop_typing`, { chat_id: chat_id as string, user_id: Me?.user_id as string });
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const isSended = await sendMessageFn({ chatSlice, Me, messageValue, receiver_id, socket })
    if (!isSended) {
      toast("Failed to send Message", { position: "top-center" })
      setMessageValue("")
    }
    setMessageValue("")
  };

  return (
    <form
      onSubmit={(e) => handleSendMessage(e)}
      className="bg-whatsapp-light-sender_bg dark:bg-whatsapp-dark-sender_bg flex place-items-center justify-between gap-[16px] px-[20px] py-[5px]"
    >
      <Attachments />
      <span className="w-full">
        <MessageInput onChange={handleMessageChange} value={messageValue} />
      </span>
      <span>
        {messageValue ? (
          <>
            <button type="submit" disabled={message_input_loading}>
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

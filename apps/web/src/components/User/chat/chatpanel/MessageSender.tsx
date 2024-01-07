import React, { ChangeEvent, FormEvent, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import MessageInput from '@/Atoms/Input/MessageInput';
import { Mutation, fetcher } from '@/utils/fetcher';
import { useDispatch, useSelector } from 'react-redux';
import { SuccessResponseType } from '@server/Misc/ResponseType.type';
import useSocket from '@/hooks/useSocket';
import { RootState } from '../../../../global/store';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { addNewMessage } from '@/global/features/messagesSlice';
import { v4 } from 'uuid';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

const MessageSender = ({ receiver_id, chat_id }: { receiver_id: string; chat_id: string | undefined }) => {
  const { id, started_from } = useSelector((state: RootState) => state.ChatSlice);

  const { Me } = useSelector((state: RootState) => state.UserSlice);

  const { socket } = useSocket();

  const [typing, setTyping] = useState(false);

  const [messageValue, setMessageValue] = useState<string>();

  const dispatch = useDispatch();

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
    const newMessage: MessageEntity = {
      content: messageValue as string,
      sended_at: new Date(),
      is_seen: false,
      id: v4(),
      received_at: null,
      seen_at: null,
      from: Me as any,
      clear_for: null,
    };
    try {
      if (started_from === 'contact') {
        // if the user selects from chat and there is not chat existed
        // then create a new chat
        const isChatStarted = await fetcher<SuccessResponseType<UserChatEntity>>(`chat/is-chat/${receiver_id}`);

        if (isChatStarted.success) {
          socket?.emit('send_message', { chat_id: isChatStarted.data?.id, message: { ...newMessage }, receiverId: receiver_id });
          dispatch(addNewMessage({ chat_id: isChatStarted.data?.id as string, message: newMessage }));
          setMessageValue('');

          return;
        }

        const response = await Mutation<{ chat_with: string }, SuccessResponseType<{ chat_id: string }>>('chat/new-chat', { chat_with: receiver_id });
        socket?.emit('send_message', { chat_id: response.data?.chat_id, message: { ...newMessage }, receiverId: receiver_id });
        dispatch(addNewMessage({ chat_id: response.data?.chat_id as string, message: newMessage }));
        setMessageValue('');
        return;
      }
      socket?.emit('send_message', { chat_id: id, message: { ...newMessage }, receiverId: receiver_id });
      dispatch(addNewMessage({ chat_id: id as string, message: newMessage }));
      setMessageValue('');
    } catch (error) {
      console.error('Error while sending message');
    }
  };

  return (
    <form
      onSubmit={(e) => handleSendMessage(e)}
      className="bg-whatsapp-light-sender_bg dark:bg-whatsapp-dark-sender_bg flex place-items-center justify-between gap-[16px] px-[20px] py-[5px]"
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

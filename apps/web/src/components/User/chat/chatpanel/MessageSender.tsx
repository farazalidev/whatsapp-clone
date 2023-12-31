import React, { ChangeEvent, FormEvent, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import MessageInput from '@/Atoms/Input/MessageInput';
import { Mutation, fetcher } from '@/utils/fetcher';
import { useSelector } from 'react-redux';
import { SuccessResponseType } from '@server/Misc/ResponseType.type';
import useSocket from '@/hooks/useSocket';
import { RootState } from '../../../../global/store';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';

const MessageSender = ({ receiver_id, chat_id }: { receiver_id: string; chat_id: string | undefined }) => {
  const { id, started_from } = useSelector((state: RootState) => state.ChatSlice);

  const { socket } = useSocket();

  // const dispatch = useDispatch();

  const [messageValue, setMessageValue] = useState<string>();

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageValue(e.target.value);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (started_from === 'contact') {
        // if the user selects from chat and there is not chat existed
        // then create a new chat
        const isChatStarted = await fetcher<SuccessResponseType<UserChatEntity>>(`chat/is-chat/${receiver_id}`);

        if (isChatStarted.success) {
          socket?.emit('send_message', { chat_id: isChatStarted.data?.id, message: { content: messageValue }, receiverId: receiver_id });
          setMessageValue('');

          return;
        }

        const response = await Mutation<{ chat_with: string }, SuccessResponseType<{ chat_id: string }>>('chat/new-chat', { chat_with: receiver_id });
        console.log('🚀 ~ file: MessageSender.tsx:41 ~ handleSendMessage ~ response:', response.data);
        socket?.emit('send_message', { chat_id: response.data?.chat_id, message: { content: messageValue }, receiverId: receiver_id });
        setMessageValue('');
        return;
      }
      socket?.emit('send_message', { chat_id: id, message: { content: messageValue }, receiverId: receiver_id });
      setMessageValue('');
    } catch (error) {
      console.log(error);
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

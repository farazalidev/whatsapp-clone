import React, { ChangeEvent, FormEvent, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import MessageInput from '@/Atoms/Input/MessageInput';
import { Mutation } from '@/utils/fetcher';
import { mutate } from 'swr';
import { useDispatch } from 'react-redux';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { SuccessResponseType } from '@server/Misc/ResponseType.type';

const MessageSender = ({ receiver_id, chat_id }: { receiver_id: string; chat_id: string | undefined }) => {
  const dispatch = useDispatch();

  const [messageValue, setMessageValue] = useState<string>();

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageValue(e.target.value);
  };
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await Mutation<{ content: string | undefined }, SuccessResponseType<string>>(`chat/message/${chat_id}/${receiver_id}`, {
        content: messageValue,
      }).then((data) => {
        if (!chat_id || chat_id === 'undefined') {
          dispatch(setUserChatEntity({ id: data.data as string, started_from: 'chat' }));
        }
      });

      mutate('api/user');
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

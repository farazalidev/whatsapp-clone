import { useEffect, useState } from 'react';
import useSocket from './useSocket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import { unreadMessage } from '@server/modules/types';
import { ICombinedData } from '@/global/features/types/types';
import { fetcher } from '@/utils/fetcher';
import { addNewMessage } from '@/global/features/messagesSlice';

interface useCombinedDataHook {
  data: ICombinedData[];
  updateData: (chat_id: string, unread_messages_length: number | undefined) => Promise<void>;
}

const useCombinedData = (): useCombinedDataHook => {
  const { socket } = useSocket();

  const { Me } = useSelector((state: RootState) => state.UserSlice);
  const { chats_raw: chats } = useSelector((state: RootState) => state.messagesSlice);

  const [unreadMessages, setUnreadMessages] = useState<unreadMessage[]>([]);

  const dispatch = useDispatch();

  const updateData = async (chat_id: string, unread_messages_length?: number) => {
    const existedUnreadMessagesChat = unreadMessages.find((chat) => chat?.chat_id === chat_id);
    if (existedUnreadMessagesChat) {
      existedUnreadMessagesChat.unread_messages = [];
      // sending request to mark all unread messages
      if (unread_messages_length !== 0) {
        await fetcher(`chat/mark-unread-messages/${chat_id}`);
      }
    }
  };

  useEffect(() => {
    socket.emit('get_unread_messages');

    socket.on(`unread_message_${Me?.user_id}`, (unreadMessageData) => {
      dispatch(addNewMessage(unreadMessageData));
      setUnreadMessages((prevMessages) => {
        const index = prevMessages.findIndex((chat) => chat.chat_id === unreadMessageData.chat_id);

        if (index !== -1) {
          return [
            ...prevMessages.slice(0, index),
            {
              ...prevMessages[index],
              unread_messages: [...prevMessages[index].unread_messages, unreadMessageData.message],
            },
            ...prevMessages.slice(index + 1),
          ];
        } else {
          return [...prevMessages, { chat_id: unreadMessageData.chat_id, unread_messages: [unreadMessageData.message] }];
        }
      });
    });
  }, [socket, Me, dispatch]);

  const combinedData = chats?.map((chat) => ({
    ...chat,
    unread_messages: unreadMessages.find((unreadMessage) => unreadMessage.chat_id === chat.id),
  }));

  return { data: combinedData, updateData };
};

export default useCombinedData;

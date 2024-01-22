import React, { FC, useEffect, useRef } from 'react';
import MessagePreview from '@/Atoms/chat/MessagePreview';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import useSocket from '@/hooks/useSocket';
import { addNewMessage, updateMessageStatus, updateMessageStatusBulk } from '@/global/features/messagesSlice';

interface ChatHandlerProps { }

const ChatHandler: FC<ChatHandlerProps> = () => {
  const { socket } = useSocket();

  const dispatch = useDispatch();

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const Me = useSelector((state: RootState) => state.UserSlice.Me);

  const divRef = useRef<HTMLDivElement>(null);

  const chat = useSelector((state: RootState) => state.messagesSlice.chats.find((chat) => chat.chat_id === id));

  useEffect(() => {

    socket.emit('init_room', { chat_id: id as string });
    socket.emit('join_room', { chat_id: id as string });

    return () => {
      socket.emit('leave_room', { room_id: id as string });
      socket.off('get_pid');
    };
  }, [socket, id, dispatch]);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(addNewMessage({ chat_id: id as string, message }));
    });
    socket.on('message_status', (messageStatus) => {
      dispatch(updateMessageStatus({ chat_id: messageStatus.chat_id, message_id: messageStatus.message_id, new_status: messageStatus.status }));
    });
    socket.on('update_message_status_bulk', (messages) => {
      dispatch(updateMessageStatusBulk(messages));
    });
    return () => {
      socket.off('message_status');
      socket.off('update_message_status_bulk');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, dispatch]);

  // scroll to bottom
  useEffect(() => {
    if (divRef.current && chat && chat?.messages?.length > 0) {
      divRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [chat]);

  useEffect(() => {
    if (divRef) {
      divRef.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [chat?.messages]);

  return (
    <>
      <div className="flex h-full w-full flex-col gap-1 overflow-y-scroll px-4 py-2 scrollbar">
        {chat?.messages
          ? [...chat.messages]

            ?.sort((a, b) => {
              const dateA = new Date(a?.sended_at)?.getTime();
              const dateB = new Date(b?.sended_at)?.getTime();
              return dateA - dateB;
            })
            .map((message) => <MessagePreview isFromMe={Me?.user_id === message?.from?.user_id} message={message} key={message?.id} />)
          : null}
        <div ref={divRef} />
      </div>
    </>
  );
};

export default ChatHandler;

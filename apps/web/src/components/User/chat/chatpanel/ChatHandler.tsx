import React, { FC, useEffect, useRef } from 'react';
import {} from 'class-transformer';
import MessagePreview from '@/Atoms/chat/MessagePreview';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import useSocket from '@/hooks/useSocket';
import { addNewMessage, updateMessageStatus, updateMessageStatusBulk } from '@/global/features/messagesSlice';

interface ChatHandlerProps {}

const ChatHandler: FC<ChatHandlerProps> = () => {
  const { socket } = useSocket();

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const messages = useSelector((state: RootState) => state.messagesSlice.chats.find((chat) => (chat.chat_id === id ? chat.messages : [])));

  const Me = useSelector((state: RootState) => state.UserSlice.Me);
  const divRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  // joining room
  useEffect(() => {
    socket.emit('init_room', { chat_id: id as string });
    socket.emit('join_room', { chat_id: id as string });
    socket.on('update_message_status_bulk', (messagesStatus) => {
      dispatch(updateMessageStatusBulk(messagesStatus));
    });
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
      socket.emit('leave_room', { room_id: id as string });
      socket.off('get_pid');
      socket.off('message_status');
      socket.off('update_message_status_bulk');
    };
  }, [socket, id, dispatch]);

  // scroll to bottom
  useEffect(() => {
    if (divRef) {
      divRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (divRef) {
      divRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, [messages]);

  return (
    <>
      <div className="relative my-2 flex h-full w-full flex-col gap-4 overflow-y-scroll px-4 ">
        {messages
          ? [...messages.messages]
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

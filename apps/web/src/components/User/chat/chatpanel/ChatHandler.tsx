import React, { FC, useEffect, useRef, useState } from 'react';
import {} from 'class-transformer';
import MessagePreview from '@/Atoms/chat/MessagePreview';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import axiosWithAuth from '@/middlewares/axiosInterceptor';
import { RootState } from '@/global/store';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import useSocket from '@/hooks/useSocket';

interface ChatHandlerProps {}

const ChatHandler: FC<ChatHandlerProps> = () => {
  const { socket } = useSocket();

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const user_id = useSelector((state: RootState) => state.UserSlice.Me?.user_id);

  // const messages = useSelector(selectChatMessages);
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const user = useUser();

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit('get_online_users');
    socket.on('users', (users) => {
      console.log(users);
    });
  }, [socket, id]);

  // joining room
  useEffect(() => {
    socket.emit('join_room', { chat_id: id as string });
    return () => {
      socket.emit('leave_room', { room_id: id as string });
    };
  }, [socket, id]);

  // receiving new message
  useEffect(() => {
    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on(`user_${user_id}`, (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off('newMessage');
      socket.off(`user_${user_id}`);
    };
  }, [socket, user_id]);

  // fetching messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosWithAuth().get<MessageEntity[]>(`chat/messages/${id}`);
        setMessages(response.data);
      } catch (error) {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [id]);

  // scroll to bottom
  useEffect(() => {
    if (divRef) {
      divRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (divRef) {
      divRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <>
      {/* {isInMyContacts ? null : <NewContactActions />} */}
      <div className="relative my-2 flex h-full w-full flex-col gap-4 overflow-y-scroll px-4">
        {messages
          ? [...messages]
              ?.sort((a, b) => {
                const dateA = new Date(a?.sended_at).getTime();
                const dateB = new Date(b?.sended_at).getTime();
                return dateA - dateB;
              })
              .map((message) => (
                <MessagePreview isFromMe={user.data?.Me.user_id === message?.from?.user_id} message={message} key={message?.id} />
              ))
          : null}
        <div ref={divRef} />
      </div>
    </>
  );
};

export default ChatHandler;

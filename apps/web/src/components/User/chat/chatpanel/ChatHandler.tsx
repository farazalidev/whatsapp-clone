import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import MessagePreview from '@/Atoms/chat/MessagePreview';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import useSocket from '@/hooks/useSocket';
import { addNewMessage, updateMessageStatus, updateMessageStatusBulk } from '@/global/features/messagesSlice';
import useCurrentChat from '@/hooks/useCurrentChat';
import usePaginatedMessages from '@/hooks/usePaginatedMessages';
import Image from 'next/image';

interface ChatHandlerProps { }

const ChatHandler: FC<ChatHandlerProps> = () => {
  const [mounted, setMounted] = useState(false)

  const { socket } = useSocket();

  const dispatch = useDispatch();

  const Me = useSelector((state: RootState) => state.UserSlice.Me);

  const divRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null)

  const { chat, id, } = useCurrentChat()

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
  }, [socket, dispatch, id]);

  // scroll to bottom
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, []);

  useEffect(() => {
    if (divRef) {
      // divRef.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [chat?.messages]);

  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice);


  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { paginate, state, meta } = usePaginatedMessages({ chat_id: id })

  const observer = useRef<IntersectionObserver>()
  const lastMessageElement = useCallback((node: any) => {
    if (state.isLoading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && meta.hasNext && mounted) {
        paginate()
      }
    })
    if (node) observer.current.observe(node)
  }, [meta.hasNext, mounted, paginate, state.isLoading])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <div ref={containerRef} className="flex h-full w-full flex-col gap-1 overflow-y-scroll px-7 py-2 scrollbar">
        {state.isLoading ?
          <div className='w-full text-xl flex justify-center place-items-center'>
            <Image src={'/icons/spinner.svg'} height={40} width={40} alt='loading spinner' />
          </div> : null}
        {chat?.messages
          ? [...chat.messages]
            ?.sort((a, b) => {
              const dateA = new Date(a?.sended_at)?.getTime();
              const dateB = new Date(b?.sended_at)?.getTime();
              return dateA - dateB;
            })
            .map((message, index) => {
              if (index === Math.ceil(chat.messages.length * .10)) {
                return (
                  <MessagePreview ref={lastMessageElement} isFromMe={Me?.user_id === message?.from?.user_id} message={message} key={message?.id} ChatSlice={chatSlice} receiver_id={receiver_id} socket={socket} Me={Me} />

                )
              } else {
                return (
                  <MessagePreview isFromMe={Me?.user_id === message?.from?.user_id} message={message} key={message?.id} ChatSlice={chatSlice} receiver_id={receiver_id} socket={socket} Me={Me} />
                )
              }
            })
          : null}
        <div ref={divRef} />
      </div>
    </>
  );
};

export default ChatHandler;

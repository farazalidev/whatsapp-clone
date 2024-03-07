import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import MessagePreview from '@/Atoms/chat/MessagePreview';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import useSocket from '@/hooks/useSocket';
import { addNewMessage, updateMessageStatus } from '@/global/features/messagesSlice';
import useCurrentChat from '@/hooks/useCurrentChat';
import usePaginatedMessages from '@/hooks/usePaginatedMessages';
import Image from 'next/image';
import { sizeChanged } from '@/utils/sizeChanged';

interface ChatHandlerProps { }

const ChatHandler: FC<ChatHandlerProps> = () => {
  const { socket } = useSocket();

  const dispatch = useDispatch();

  const Me = useSelector((state: RootState) => state.UserSlice.Me);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { chat, id, } = useCurrentChat()

  const [scrolled, setScrolled] = useState(false)

  const [currentMessagesSize, setCurrentMessagesSize] = useState<number | undefined>(chat?.messages?.length)

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
      dispatch(addNewMessage({ chat_id: id || message.chat_id, message: message.message }));
    });
    socket.on('message_status', (messageStatus) => {
      dispatch(updateMessageStatus({ chat_id: messageStatus.chat_id, message_id: messageStatus.message_id, new_status: messageStatus.status }));
    });
    return () => {
      socket.off('message_status');
    };
  }, [socket, dispatch, id]);

  useEffect(() => {
    if (bottomRef) {
      bottomRef.current?.scrollIntoView()
      setScrolled(true)
    }
  }, [bottomRef, id]);

  useEffect(() => {
    sizeChanged(currentMessagesSize, chat?.messages?.length, (newSize, changedSize) => {
      setCurrentMessagesSize(newSize)
      if (bottomRef && changedSize && changedSize < 2) {
        bottomRef.current?.scrollIntoView()
      }
    })
  }, [chat?.messages, currentMessagesSize])

  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice);

  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { paginate, state, meta } = usePaginatedMessages({ chat_id: id })

  const observer = useRef<IntersectionObserver>()
  const lastMessageElement = useCallback((node: any) => {
    if (state.isLoading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && meta.hasNext && scrolled) {

        paginate()
      }
    })
    if (node) observer.current.observe(node)
  }, [meta.hasNext, paginate, scrolled, state.isLoading])


  return (
    <>
      <div className="flex h-full w-full flex-col gap-1 overflow-y-scroll overflow-x-hidden px-7 py-2 scrollbar bottom-[3.7%]">
        {state.isLoading ?
          <div className='w-full text-xl flex justify-center place-items-center'>
            <Image src={'/icons/spinner.svg'} height={40} width={40} alt='loading spinner' />
          </div> : null}
        {chat?.messages
          ? [...chat.messages].reverse()
            .map((message, index) => {
              if (index === Math.ceil(chat?.messages?.length || 0 * .1)) {
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
        <div ref={bottomRef} ></div>
      </div>
    </>
  );
};

export default ChatHandler;

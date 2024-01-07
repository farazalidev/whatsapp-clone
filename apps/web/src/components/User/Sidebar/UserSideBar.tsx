'use client';
import React, { Suspense, useEffect, useState } from 'react';
import SideBarHeader from './SideBarHeader';
import SideBarSearch from './SideBarSearch';
import EncryptionMessage from '@/Atoms/misc/EncryptionMessage';
import SideBarOverlay from './SideBarOverlay';
import { overlayContent } from './overlaycontent/overlaycontet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import SideBarUserCard from './SideBarUseCard';
import Typography from '@/Atoms/Typography/Typography';
import SidebarChatsSkeleton from '@/skeletons/Components/SidebarChatsSkeleton';
import { getDayOrFormattedDate } from '@/utils/getDateOrFormat';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { isIamReceiver } from '../../../utils/isIamReceiver';
import { getLatestMessage } from '@/utils/getLatestMessage';
import useSocket from '@/hooks/useSocket';
import { unreadMessage } from '@server/modules/types';
import { fetcher } from '@/utils/fetcher';

const UserSideBar = () => {
  const { socket } = useSocket();

  const dispatch = useDispatch();

  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  const [unreadMessages, setUnreadMessages] = useState<unreadMessage[]>([]);

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const data = useSelector((state: RootState) => state.UserSlice);

  const handleChat = async (chat_id: string, unread_messages_length: number | undefined) => {
    dispatch(setUserChatEntity({ id: chat_id, started_from: 'chat' }));

    const existedUnreadMessagesChat = unreadMessages.find((chat) => chat?.chat_id === chat_id);
    if (existedUnreadMessagesChat) {
      existedUnreadMessagesChat.unread_messages = [];
      // sending request to mark all unread messages
      if (unread_messages_length !== 0) {
        await fetcher(`chat/mark-unread-messages/${chat_id}`);
      }
    }
    return;
  };

  useEffect(() => {
    socket.emit('get_unread_messages');
    socket.on(`unread_messages_${data?.Me!.user_id}`, (messages) => {
      setUnreadMessages(messages);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    socket.on(`unread_message_${data?.Me!.user_id}`, (unreadMessageData) => {
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
  }, [socket, data.Me]);

  const combinedData = data?.chats!.map((chat) => ({
    ...chat,
    unread_messages: unreadMessages.find((unreadMessage) => unreadMessage.chat_id === chat.id),
  }));

  return (
    <div className="dark:bg-whatsapp-dark-primary_bg relative flex h-full flex-col overflow-x-hidden border-r-[2px] border-r-gray-300 bg-white dark:border-r-gray-600">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />

      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <Suspense fallback={<SidebarChatsSkeleton />}>
        <div className="dark:bg-whatsapp-dark-primary_bg h-[100%] overflow-y-scroll ">
          {combinedData && data?.Me && combinedData.length !== 0 ? (
            combinedData?.map((chat) => {
              return (
                <SideBarUserCard
                  key={chat.id}
                  name={isIamReceiver(chat.chat_with.user_id, data?.Me!.user_id) ? chat.chat_for.name : chat?.chat_with.name}
                  // last_message={getLatestMessage(chat?.messages)?.content}
                  last_message={
                    chat.unread_messages?.unread_messages
                      ? getLatestMessage(chat.unread_messages?.unread_messages)?.content
                      : null || getLatestMessage(chat?.messages)?.content
                  }
                  last_message_date={
                    chat.unread_messages?.unread_messages
                      ? getDayOrFormattedDate(chat.unread_messages?.unread_messages)
                      : chat?.messages
                        ? getDayOrFormattedDate(chat?.messages)
                        : undefined
                  }
                  active={chat.id === id}
                  avatar_path={isIamReceiver(chat.chat_with.user_id, data?.Me!.user_id) ? chat.chat_for.profile.pic_path : chat?.chat_with.profile.pic_path}
                  onClick={() => handleChat(chat.id, chat.unread_messages?.unread_messages?.length)}
                  unread_message_count={chat.unread_messages?.unread_messages.length}
                />
              );
            })
          ) : (
            <Typography className="flex h-full w-full place-items-center justify-center">No messages yet</Typography>
          )}
        </div>

        <EncryptionMessage />
      </Suspense>
    </div>
  );
};

export default UserSideBar;

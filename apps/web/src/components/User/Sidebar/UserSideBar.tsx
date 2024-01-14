'use client';
import React, { Suspense, useState } from 'react';
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
import { AnimatePresence, Reorder } from 'framer-motion';
import { ICombinedData } from '@/global/features/types/types';
import useCombinedData from '@/hooks/useCombinedData';

const UserSideBar = () => {
  const dispatch = useDispatch();

  const { selectedOverlay, show } = useSelector((state: RootState) => state.sideBarOverlaySlice);

  const { id } = useSelector((state: RootState) => state.ChatSlice);

  const data = useSelector((state: RootState) => state.UserSlice);

  const { data: combinedData, updateData } = useCombinedData();

  const handleChat = async (chat_id: string, unread_messages_length: number | undefined) => {
    dispatch(setUserChatEntity({ id: chat_id, started_from: 'chat' }));

    await updateData(chat_id, unread_messages_length);
  };

  const [chatsData, setChatsData] = useState<ICombinedData[]>(combinedData);

  return (
    <div className="dark:bg-whatsapp-dark-primary_bg relative flex h-full flex-col overflow-x-hidden border-r-[2px] border-r-gray-300 bg-white dark:border-r-gray-600">
      <SideBarOverlay show={show} heading={overlayContent[selectedOverlay].heading} Content={overlayContent[selectedOverlay].content} />

      <div>
        <SideBarHeader />
        <SideBarSearch />
      </div>
      <Suspense fallback={<SidebarChatsSkeleton />}>
        <Reorder.Group values={chatsData} onReorder={setChatsData} className="dark:bg-whatsapp-dark-primary_bg h-[100%] overflow-y-scroll ">
          {combinedData && data?.Me && combinedData.length !== 0 ? (
            combinedData?.map((chat) => {
              return (
                <AnimatePresence key={chat.id}>
                  <Reorder.Item value={chat} as="ul">
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
                      for_other
                      user_id={chat.chat_with.user_id}
                      onClick={() => handleChat(chat.id, chat.unread_messages?.unread_messages?.length)}
                      unread_message_count={chat.unread_messages?.unread_messages.length}
                    />
                  </Reorder.Item>
                </AnimatePresence>
              );
            })
          ) : (
            <Typography className="flex h-full w-full place-items-center justify-center">No messages yet</Typography>
          )}
        </Reorder.Group>

        <EncryptionMessage />
      </Suspense>
    </div>
  );
};

export default UserSideBar;

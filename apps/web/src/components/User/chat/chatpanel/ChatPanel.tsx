import React, { Suspense } from 'react';
import ChatPanelHeader from './ChatPanelHeader';
import ChatHandler from './ChatHandler';
import MessageSender from './MessageSender';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import useUser from '@/hooks/useUser';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';

const ChatPanel = () => {
  const chat = useSelector((state: RootState) => state.ChatSlice);

  const { data, isLoading } = useUser();

  type ContactWithProfileType = {
    Contact: ContactEntity;
    profile_blob: Blob;
  };

  let userChat: UserChatEntity | ContactWithProfileType | undefined;
  if (chat.chatIsStarted && !isLoading) {
    userChat = data?.chats.find((userChat) => userChat.user.user_id === chat.user_id);
  } else if (!chat.chatIsStarted) {
    userChat = data?.contacts.find((user) => user.Contact.contact.user_id === chat.user_id);
  }

  return (
    <div className="w-full h-full  bg-pattern">
      <div className="flex flex-col w-full h-full bg-[#F5DEB3] bg-opacity-25 dark:bg-whatsapp-dark-primary_bg dark:bg-opacity-95">
        <Suspense fallback={<FallBackLoadingSpinner />}>
          <ChatPanelHeader
            header_name={
              chat.chatIsStarted
                ? ((userChat as UserChatEntity)?.user.name as string)
                : (userChat as ContactWithProfileType)?.Contact.contact.username
            }
            avatar_path={
              chat.chatIsStarted
                ? (userChat as UserChatEntity)?.user.profile.pic_path
                : (userChat as ContactWithProfileType)?.Contact.contact.profile.pic_path
            }
          />
          <ChatHandler messages={chat.chatIsStarted ? (userChat as UserChatEntity)?.messages : []} />
          <MessageSender />
        </Suspense>
      </div>
    </div>
  );
};

export default ChatPanel;

import { addPaginatedChat, removePaginatedChat } from '@/global/features/messagesSlice';
import { store } from '@/global/store';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { v4 } from 'uuid';
import { Mutation } from './fetcher';
import { SuccessResponseType } from '@server/Misc/ResponseType.type';
import { toast } from 'sonner';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { createSocket } from './createSocket';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { sendMessage } from './sendMessageFn';

interface IStartNewChatArgs {
  message: MessageEntity;
}

type IStartNewChat = (args: IStartNewChatArgs) => void;

export const start_newChat: IStartNewChat = async (args) => {
  const { Me } = store.getState().UserSlice;

  const { chat_receiver } = store.getState().ChatSlice;

  const chat_id: string = v4();
  try {
    if (Me && chat_receiver) {
      const newChat: UserChatEntity = {
        id: chat_id,
        chat_for: Me,
        chat_with: chat_receiver,
        messages: [{ ...args.message }],
      };

      store.dispatch(addPaginatedChat(newChat));

      store.dispatch(
        setUserChatEntity({ id: chat_id, started_from: 'chat', receiver_id: chat_receiver.user_id, chat_receiver: chat_receiver, status: 'pending' }),
      );
      const response = await Mutation<{ chat: UserChatEntity }, SuccessResponseType<{ chat: UserChatEntity }>>('chat/new-chat', {
        chat: newChat,
      });

      if (response.success) {
        const pendingMessages = store.getState().messagesSlice.paginatedChats.data.find((chat) => chat.id === chat_id);
        if (pendingMessages?.messages) {
          await Promise.all(
            pendingMessages?.messages.map(async (message) => {
              if (response.data?.chat) {
                const newsSocket = createSocket();
                return await sendMessage({
                  chat: { chat_for: response.data.chat.chat_for, chat_with: response.data.chat.chat_with, id: response.data.chat.id },
                  message,
                  receiver_id: chat_receiver.user_id,
                  socket: newsSocket.socket,
                });
              }
              toast.error('Failed to Send messages', { position: 'bottom-left' });
              store.dispatch(removePaginatedChat({ chat_id }));
            }),
          );
        }
        store.dispatch(
          setUserChatEntity({ id: chat_id, started_from: 'chat', receiver_id: chat_receiver.user_id, chat_receiver: chat_receiver, status: 'created' }),
        );
        toast.success('started new chat', { position: 'top-left' });
      }

      if (!response.success) {
        store.dispatch(removePaginatedChat({ chat_id }));
      }
    }
  } catch (error) {
    toast.error('Failed to Send messages', { position: 'bottom-left' });
    store.dispatch(removePaginatedChat({ chat_id }));
  }
};

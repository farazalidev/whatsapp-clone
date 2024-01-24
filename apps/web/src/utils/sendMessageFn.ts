import { addNewMessage } from '@/global/features/messagesSlice';
import { v4 } from 'uuid';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { start_newChat } from './start_newChat';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { IChatSlice } from '@/global/features/ChatSlice';
import { ISocket_Client } from './createSocket';
import { store } from '@/global/store';

interface ISendMessageFnArgs {
  socket: ISocket_Client;
  messageValue: string | undefined;
  Me: UserEntity | null;
  chatSlice: IChatSlice;
  receiver_id: string;
}

type SendMessageFnType = (args: ISendMessageFnArgs) => Promise<boolean>;

export const sendMessageFn: SendMessageFnType = async ({ Me, chatSlice, messageValue, receiver_id, socket }) => {
  const newMessage: MessageEntity = {
    content: messageValue as string,
    sended_at: new Date(),
    messageType: 'text',
    media: null,
    is_seen: false,
    id: v4(),
    received_at: null,
    seen_at: null,
    from: Me as any,
    clear_for: null,
    sended: false,
  };
  try {
    if (chatSlice.started_from === 'chat') {
      // if the user selects from chat and there is not chat existed
      // then create a new chat

      socket?.emit('send_message', { chat_id: chatSlice.id, message: { ...newMessage }, receiverId: receiver_id });
      store.dispatch(addNewMessage({ chat_id: chatSlice.id as string, message: newMessage }));

      return true;
    }

    start_newChat(socket, chatSlice.id, newMessage);
    return true;
  } catch (error) {
    console.error('Error while sending message');
    return false;
  }
};

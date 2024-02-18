import { addNewMessage } from '@/global/features/messagesSlice';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { start_newChat } from './start_newChat';
import { IChatSlice } from '@/global/features/ChatSlice';
import { ISocket_Client } from './createSocket';
import { store } from '@/global/store';

interface ISendMessageFnArgs {
  socket: ISocket_Client | undefined;
  chatSlice: IChatSlice | undefined;
  receiver_id: string;
  message: MessageEntity;
}

type SendMessageFnType = (args: ISendMessageFnArgs) => Promise<boolean>;

export const sendMessageFn: SendMessageFnType = async ({ chatSlice, receiver_id, socket, message }) => {
  try {
    if (chatSlice?.started_from === 'chat') {
      // if the user selects from chat and there is not chat existed
      // then create a new chat

      socket?.emit('send_message', { chat_id: chatSlice.id, message: { ...message }, receiverId: receiver_id });
      if (message.messageType === 'text') {
        store.dispatch(addNewMessage({ chat_id: chatSlice.id as string, message: message }));
      }
      return true;
    }

    start_newChat(socket, chatSlice?.id, message);
    return true;
  } catch (error) {
    console.error('Error while sending message');
    return false;
  }
};

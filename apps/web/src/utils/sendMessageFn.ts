import { addNewMessage } from '@/global/features/messagesSlice';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { ISocket_Client } from './createSocket';
import { store } from '@/global/store';
import { start_newChat } from './start_newChat';

interface ISendMessageFnArgs {
  socket: ISocket_Client | undefined;
  message: MessageEntity;
}

type SendMessageFnType = (args: ISendMessageFnArgs) => Promise<boolean>;

export const sendMessageFn: SendMessageFnType = async ({ socket, message }) => {
  const { started_from, id, receiver_id } = store.getState().ChatSlice;

  try {
    if (started_from === 'chat' && receiver_id) {
      // if the user selects from chat and there is not chat existed
      // then create a new chat

      socket?.emit('send_message', { chat_id: id, message: { ...message }, receiverId: receiver_id });
      if (message.messageType === 'text') {
        store.dispatch(addNewMessage({ chat_id: id as string, message: message }));
      }
      return true;
    }

    start_newChat({ message });
    return true;
  } catch (error) {
    console.error('Error while sending message');
    return false;
  }
};

interface ISendMessageArgs {
  socket: ISocket_Client | undefined;
  message: MessageEntity;
  receiver_id: string;
  chat_id: string;
}

type SendMessageType = (args: ISendMessageArgs) => Promise<boolean>;

export const sendMessage: SendMessageType = async ({ socket, message, receiver_id, chat_id }) => {
  try {
    socket?.emit('send_message', { chat_id, message: { ...message }, receiverId: receiver_id });
    return true;
  } catch (error) {
    console.error('Error while sending message');
    return false;
  }
};

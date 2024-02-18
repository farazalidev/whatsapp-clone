import { addNewChat, addNewMessage, removeChat } from '@/global/features/messagesSlice';
import { store } from '@/global/store';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { v4 } from 'uuid';
import { Mutation } from './fetcher';
import { SuccessResponseType } from '@server/Misc/ResponseType.type';
import { toast } from 'sonner';
import { setUserChatEntity } from '@/global/features/ChatSlice';
import { ISocket_Client } from './createSocket';
import { setLoading } from '@/global/loadingSlice';
import { mutate } from 'swr';
import { isIamReceiver } from './isIamReceiver';

type IStartANewChat = (socket: ISocket_Client | undefined, receiver_id: string | undefined, message: MessageEntity) => void;

/**
 * This function has responsibility to start a new chat
 * @param receiver_id to create a new chat with the receiver
 * @param message message to send
 */
export const start_newChat: IStartANewChat = async (socket, receiver_id, message) => {
  const chat_id: string = v4();

  const ReceiverFootPrints = store.getState().messagesSlice.chats.find((chat) => chat.receiverFootPrints === receiver_id);

  if (ReceiverFootPrints) {
    // if the user already started a new chat with this user
    // then only add new messages
    store.dispatch(addNewMessage({ chat_id: ReceiverFootPrints.chat_id, message }));
  }

  /**
   * first we will add a new chat in chats list
   * then we will append a new message into the chat messages
   * if the user will send multiple message we will append it to the same chat
   */
  store.dispatch(addNewChat({ chat_id, messages: [message], receiverFootPrints: receiver_id }));
  try {
    store.dispatch(setLoading({ message_input_loading: true }));
    const response = await Mutation<{ chat_with: string; chat_id: string }, SuccessResponseType<{ chat_id: string }>>('chat/new-chat', {
      chat_with: receiver_id as string,
      chat_id,
    });
    const createdChat = store.getState().messagesSlice.chats.find((chat) => chat.chat_id === response.data?.chat_id);
    if (createdChat?.receiverFootPrints === receiver_id && createdChat?.messages) {
      for (const message of createdChat.messages) {
        socket?.emit('send_message', { chat_id: response.data?.chat_id, message, receiverId: receiver_id as string });
      }
    }
    const raw_chat = store.getState().messagesSlice.chats_raw.find((chat) => chat.id === chat_id);
    const { Me } = store.getState().UserSlice;

    const isMeReceiver = isIamReceiver(raw_chat?.chat_with.user_id, Me?.user_id);

    const receiver_user = isMeReceiver ? raw_chat?.chat_for : raw_chat?.chat_with;

    mutate('api/chats');
    store.dispatch(setUserChatEntity({ id: response.data?.chat_id, started_from: 'chat', receiver_id, chat_receiver: receiver_user }));
  } catch (error) {
    toast.error('Error while starting a new chat');
    store.dispatch(setUserChatEntity({ id: '', started_from: null, receiver_id, chat_receiver: undefined }));
    store.dispatch(removeChat({ chat_id }));
  } finally {
    store.dispatch(setLoading({ message_input_loading: false }));
  }
};

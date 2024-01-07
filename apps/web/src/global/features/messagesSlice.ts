import { createSlice } from '@reduxjs/toolkit';
import { UpdateMessageStatusBulk } from '@shared/types';
import { messageStatus } from '@shared/types';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';

interface IMessagesSliceInitialState {
  chats: { chat_id: string; messages: MessageEntity[]; receiverFootPrints?: string }[];
  chats_raw: UserChatEntity[];
}
interface addNewChatPayload {
  chat_id: string;
  messages: MessageEntity[];
  receiverFootPrints?: string;
}
interface addNewMessagePayload {
  chat_id: string;
  message: MessageEntity;
}

interface updateMessagePayload {
  chat_id: string;
  message_id: string;
  new_status: messageStatus;
}

const initialState: IMessagesSliceInitialState = {
  chats: [],
  chats_raw: [],
};

export const messagesSlice = createSlice({
  name: 'messages-slice',
  initialState,
  reducers: {
    // add new chat
    addNewChat: (state, { payload }: { payload: addNewChatPayload }) => {
      const existedChat = state.chats.find((chat) => chat.chat_id === payload.chat_id);
      if (!existedChat) {
        state.chats.push(payload);
        return;
      }
      for (const message of existedChat.messages) {
        const existingMessage = payload.messages.some((newMessage) => newMessage.id === message.id);
        if (existingMessage) {
          return;
        }
        existedChat.messages.push(...payload.messages);
      }
    },

    addRawChats: (state, { payload }: { payload: UserChatEntity[] | undefined }) => {
      if (payload) {
        state.chats_raw = payload;
      }
    },

    removeChat: (state, { payload }: { payload: { chat_id: string } }) => {
      state.chats.filter((chat) => chat.chat_id !== payload.chat_id);
    },

    // add a new message

    addNewMessage: (state, { payload }: { payload: addNewMessagePayload }) => {
      const existedChat = state.chats.find((chat) => chat.chat_id === payload.chat_id);
      existedChat?.messages.push(payload.message);
    },

    // update message status

    updateMessageStatus: (state, { payload }: { payload: updateMessagePayload }) => {
      const { chat_id, message_id, new_status } = payload;
      const chatIndex = state.chats.findIndex((chat) => chat.chat_id === chat_id);

      if (chatIndex !== -1) {
        const messageIndex = state.chats[chatIndex].messages.findIndex((message) => message.id === message_id);

        if (messageIndex !== -1) {
          state.chats[chatIndex].messages[messageIndex] = {
            ...state.chats[chatIndex].messages[messageIndex],
            ...new_status,
          };
        }
      }
    },

    updateMessageStatusBulk: (state, { payload }: { payload: UpdateMessageStatusBulk }) => {
      const chatIndex = state.chats.findIndex((chat) => chat.chat_id === payload.chat_id);

      if (chatIndex !== -1) {
        state.chats[chatIndex].messages = state.chats[chatIndex].messages.map((message) => {
          const updatedMessage = payload.messages.find((updated) => updated.id === message.id);
          return updatedMessage ? { ...message, ...updatedMessage } : message;
        });
      }
    },
  },
});

export const { addNewChat, addNewMessage, updateMessageStatus, updateMessageStatusBulk, removeChat, addRawChats } = messagesSlice.actions;

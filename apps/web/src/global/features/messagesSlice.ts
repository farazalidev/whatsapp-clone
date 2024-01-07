import { createSlice } from '@reduxjs/toolkit';
import { UpdateMessageStatusBulk } from '@shared/types';
import { messageStatus } from '@shared/types';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

interface IMessagesSliceInitialState {
  chats: { chat_id: string; messages: MessageEntity[] }[];
}
interface addNewChatPayload {
  chat_id: string;
  messages: MessageEntity[];
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

export const { addNewChat, addNewMessage, updateMessageStatus, updateMessageStatusBulk } = messagesSlice.actions;

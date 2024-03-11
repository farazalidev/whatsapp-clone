import { createSlice } from '@reduxjs/toolkit';
import { UpdateMessageStatusBulk } from '@shared/types';
import { messageStatus } from '@shared/types';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { ChatsDto, PaginatedMessages } from '@server/modules/chat/DTO/chats.dto';
import { chatPaginationConfig } from '@/config/chatPagination.config';

interface IMessagesSliceInitialState {
  chats: { chat_id: string; messages: MessageEntity[]; receiverFootPrints?: string }[];
  chats_raw: UserChatEntity[];
  paginatedChats: ChatsDto;
}
interface addNewChatPayload {
  chat_id: string;
  messages: MessageEntity[];
  receiverFootPrints?: string;
}
interface addNewMessagePayload {
  chat_id: string | undefined;
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
  paginatedChats: { data: [], meta: { currentPage: 0, hasNext: false, hasPrevious: false, messagesTake: 0, take: 0, totalChats: 0, totalPages: 0 } },
};

export const messagesSlice = createSlice({
  name: 'messages-slice',
  initialState,
  reducers: {
    initPaginatedChats: (state, { payload }: { payload: ChatsDto }) => {
      state.paginatedChats = payload;
    },

    paginateChatMessages: (state, { payload }: { payload: { chat_id: string; paginatedMessages: PaginatedMessages } }) => {
      const chat = state.paginatedChats.data.find((chat) => chat.id === payload?.chat_id);
      if (chat && payload) {
        const meta = payload.paginatedMessages.meta;
        chat?.messages?.push(...new Set([...payload.paginatedMessages.messages]));
        chat.count = meta.totalMessages;
        chat.currentPage = meta.currentPage;
        chat.hasNext = meta.hasNext;
        chat.hasPrev = meta.hasPrevious;
        chat.totalMessagesPages = meta.totalPages;
      }
    },

    addPaginatedChat: (state, { payload }: { payload: UserChatEntity }) => {
      const isChatExisted = state.paginatedChats.data.find((chat) => chat.id === payload.id);
      console.log('🚀 ~ isChatExisted:', isChatExisted);

      if (isChatExisted) {
        return;
      }

      state.paginatedChats.data.push({
        ...payload,
        count: 1,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
        messagesTake: chatPaginationConfig.messagesTake,
        totalMessagesPages: 1,
      });
    },

    addLocalMediaMessages: (state, { payload }: { payload: MessageEntity[] }) => {
      for (const message of payload) {
        const chat = state.paginatedChats.data.find((chat) => {
          return chat.id === message.chat.id;
        });
        if (chat) {
          chat.messages?.unshift(message);
        }
      }
    },

    removePaginatedChat: (state, { payload }: { payload: { chat_id: string } }) => {
      state.paginatedChats.data.filter((chat) => chat.id !== payload.chat_id);
    },

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
      state.paginatedChats.data.filter((chat) => chat.id !== payload.chat_id);
    },

    // add a new message

    addNewMessage: (state, { payload }: { payload: addNewMessagePayload }) => {
      console.log('🚀 ~ payload:', payload);
      const existedChat = state.paginatedChats.data.find((chat) => chat?.id === payload.chat_id);
      if (existedChat) existedChat?.messages?.unshift(payload.message);
      return;
    },

    // update message status

    updateMessageStatus: (state, { payload }: { payload: updateMessagePayload }) => {
      const { chat_id, message_id, new_status } = payload;
      const chatIndex = state.paginatedChats.data.findIndex((chat) => chat.id === chat_id);
      if (chatIndex !== -1) {
        const messageIndex = state?.paginatedChats?.data[chatIndex]?.messages?.findIndex((message) => message.id === message_id);

        if (messageIndex && messageIndex !== -1 && state.paginatedChats.data) {
          state.paginatedChats.data[chatIndex].messages![messageIndex] = {
            ...state?.paginatedChats?.data[chatIndex]?.messages![messageIndex],
            ...new_status,
          };
        }
      }
    },

    updateMessageStatusBulk: (state, { payload }: { payload: UpdateMessageStatusBulk }) => {
      const chatIndex = state.paginatedChats.data.findIndex((chat) => chat.id === payload.chat_id);

      if (chatIndex !== -1) {
        state.paginatedChats.data[chatIndex].messages = state?.paginatedChats?.data[chatIndex]?.messages?.map((message) => {
          const updatedMessage = payload.messages.find((updated) => updated.id === message.id);
          return updatedMessage ? { ...message, ...updatedMessage } : message;
        });
      }
    },
  },
});

export const {
  addNewChat,
  addNewMessage,
  updateMessageStatus,
  updateMessageStatusBulk,
  removeChat,
  addRawChats,
  initPaginatedChats,
  paginateChatMessages,
  addPaginatedChat,
  removePaginatedChat,
  addLocalMediaMessages,
} = messagesSlice.actions;

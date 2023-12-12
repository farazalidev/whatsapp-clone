import { apiSlice } from './ApiSlice';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';

export const ChatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<UserChatEntity[], void>({
      query: () => ({
        url: 'chat/user-chats',
        method: 'GET',
      }),
    }),

    // get chat by id
    getChatById: builder.query<UserChatEntity, { chat_id: string }>({
      query: ({ chat_id }) => ({
        url: `user/${chat_id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetChatsQuery, useGetChatByIdQuery } = ChatApi;

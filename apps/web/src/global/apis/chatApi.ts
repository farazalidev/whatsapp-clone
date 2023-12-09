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
  }),
});

export const { useGetChatsQuery } = ChatApi;

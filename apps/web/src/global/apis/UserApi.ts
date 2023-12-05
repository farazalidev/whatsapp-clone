import { ChatRequestEntity } from '@server/modules/user/entities/chat_requests.entity';
import { apiSlice } from './ApiSlice';
import { UserEntity } from '@server/modules/user/entities/user.entity';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserEntity, void>({
      query: () => ({
        url: 'user/profile',
        method: 'GET',
      }),
    }),
    searchUser: builder.query<{ email: string }, { user_email: string }>({
      query: (body) => ({
        url: `user/search-user/${body.user_email}`,
        method: 'GET',
      }),
    }),
    sendChatRequest: builder.mutation<ChatRequestEntity, { acceptor_email: string }>({
      query: (body) => ({
        url: 'user/send-request',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useSearchUserQuery, useSendChatRequestMutation } = userApi;

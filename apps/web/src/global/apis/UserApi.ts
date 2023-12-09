import { ChatRequestEntity } from '@server/modules/user/entities/chatRequest.entity';
import { apiSlice } from './ApiSlice';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { UserProfileEntity } from '@server/modules/user/entities/userprofile.entity';

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
    getProfile: builder.query<UserProfileEntity, void>({
      query: () => ({
        url: 'user/profile',
        method: 'GET',
      }),
    }),
    getProfilePic: builder.query<string, { path: string }>({
      query: (body) => {
        return { url: `user/profile-image/${body.path}`, method: 'GET' };
      },
    }),
  }),
});

export const { useGetUserProfileQuery, useSearchUserQuery, useSendChatRequestMutation, useGetProfileQuery, useGetProfilePicQuery } =
  userApi;

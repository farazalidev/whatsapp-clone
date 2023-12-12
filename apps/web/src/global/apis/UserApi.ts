import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { apiSlice } from './ApiSlice';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { UserProfileEntity } from '@server/modules/user/entities/userprofile.entity';
import { SuccessResponse } from '@server/Misc/ResponseType.type';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserEntity, void>({
      query: () => ({
        url: 'user/profile',
        method: 'GET',
      }),
    }),

    getMe: builder.query<UserEntity, void>({
      query: () => ({
        url: 'user/me',
        method: 'GET',
      }),
    }),
    searchUser: builder.query<{ email: string }, { user_email: string }>({
      query: (body) => ({
        url: `user/search-user/${body.user_email}`,
        method: 'GET',
      }),
    }),

    // get profile
    getProfile: builder.query<UserProfileEntity, void>({
      query: () => ({
        url: 'user/profile',
        method: 'GET',
      }),
    }),

    // get profile pic
    getProfilePic: builder.query<Blob, { path: string }>({
      query: (body) => {
        return {
          url: `user/profile-image/${body.path}`,
          method: 'GET',
          responseHandler: (response: any) => {
            return response?.blob();
          },
        };
      },
    }),

    // get contacts
    getContacts: builder.query<ContactEntity[], void>({
      query: () => ({
        url: 'user/contacts',
        method: 'GET',
      }),
    }),

    // add new contact
    addNewContact: builder.mutation<SuccessResponse, { email: string }>({
      query: ({ email }) => ({
        url: `user/add-contact/${email}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useSearchUserQuery,
  useGetProfileQuery,
  useGetProfilePicQuery,
  useGetMeQuery,
  useAddNewContactMutation,
  useGetContactsQuery,
} = userApi;

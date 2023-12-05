import { SuccessResponseType } from '@server/Misc/ResponseType.type';
import { apiSlice } from './ApiSlice';
import { RegisterUser, LoginUser, VerifyUserPayload, CompleteProfileBody } from './api.types';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    RegisterApi: builder.mutation<any, RegisterUser>({
      query: (user) => ({
        url: 'auth/register',
        body: user,
        method: 'POST',
        credentials: 'include',
      }),
    }),
    LoginApi: builder.mutation<any, LoginUser>({
      query: (user) => ({
        url: 'auth/login',
        body: user,
        method: 'POST',
        credentials: 'include',
      }),
    }),

    verifyUser: builder.mutation<any, VerifyUserPayload>({
      query: (otp) => ({
        url: 'auth/verify-user',
        body: otp,
        credentials: 'include',
        method: 'POST',
      }),
    }),

    uploadProfilePic: builder.mutation<SuccessResponseType<{ format: string; public_id: string }>, FormData>({
      query: (image) => ({
        url: '/image/upload/profile-pic',
        body: image,
        credentials: 'include',
        method: 'POST',
      }),
    }),
    completeProfile: builder.mutation<SuccessResponseType, CompleteProfileBody>({
      query: (userProfile) => ({
        url: 'user/complete-profile',
        body: userProfile,
        credentials: 'include',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterApiMutation,
  useLoginApiMutation,
  useVerifyUserMutation,
  useUploadProfilePicMutation,
  useCompleteProfileMutation,
} = authApiSlice;

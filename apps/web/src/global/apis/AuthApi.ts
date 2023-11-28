import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginUser, RegisterUser, VerifyUserPayload } from './api.types';

export const AuthApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
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
  }),
});

export const { useRegisterApiMutation, useLoginApiMutation, useVerifyUserMutation } = AuthApi;

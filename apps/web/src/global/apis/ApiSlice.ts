'use client';
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/utils/getCookie';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const accessToken = getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME);
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// wrapper for BaseQuery
const BaseQueryReAuth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    console.log('sending refresh token');
    const refreshResult = await baseQuery('auth/refresh', api, extraOptions);
    result = refreshResult;
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: BaseQueryReAuth,
  endpoints: (builder) => ({}),
});

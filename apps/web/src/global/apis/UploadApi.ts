import { apiSlice } from './ApiSlice';

export const UploadApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    uploadProfilePic: build.mutation<{ file_path: string }, FormData>({
      query: (file) => ({
        body: file,
        method: 'POST',
        url: 'file/upload/profile-pic',
      }),
    }),
  }),
});

export const { useUploadProfilePicMutation } = UploadApi;

import { createSlice } from '@reduxjs/toolkit';

interface InitialStateType {
  user_id: string;
}

const initialState: InitialStateType = {
  user_id: '',
};

export const ChatSlice = createSlice({
  name: 'chat_slice',
  initialState,
  reducers: {
    setChatUserId: (state, { payload }: { payload: string }) => {
      state.user_id = payload;
    },
  },
});

export const { setChatUserId } = ChatSlice.actions;

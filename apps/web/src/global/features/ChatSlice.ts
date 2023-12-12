import { createSlice } from '@reduxjs/toolkit';

interface InitialStateType {
  user_id: string | null;
  chatIsStarted: boolean;
}

const initialState: InitialStateType = {
  user_id: null,
  chatIsStarted: false,
};

export const ChatSlice = createSlice({
  name: 'chat_slice',
  initialState,
  reducers: {
    setUserChatEntity: (state, { payload }: { payload: Partial<InitialStateType> }) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});

export const { setUserChatEntity } = ChatSlice.actions;

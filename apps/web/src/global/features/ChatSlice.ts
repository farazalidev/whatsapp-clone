import { createSlice } from '@reduxjs/toolkit';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';

interface InitialStateType {
  chat_entity: UserChatEntity | null;
  avatar: string | null;
}

const initialState: InitialStateType = {
  chat_entity: null,
  avatar: null,
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

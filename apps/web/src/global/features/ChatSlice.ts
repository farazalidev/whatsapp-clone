import { createSlice } from '@reduxjs/toolkit';
import { UserEntity } from '@server/modules/user/entities/user.entity';

export interface IChatSlice {
  /**
   * id can be a chat_id or user_id
   * if the chat is started from contact then
   * id will be user_id
   * else id will be chat_id
   */
  id: string | undefined;

  started_from: 'chat' | 'contact' | null;

  receiver_id: string | undefined;

  chat_receiver: UserEntity | undefined;

  status?: 'pending' | 'created';
}

const initialState: IChatSlice = {
  started_from: null,
  id: undefined,
  receiver_id: undefined,
  chat_receiver: undefined,
};

export const ChatSlice = createSlice({
  name: 'chat_slice',
  initialState,
  reducers: {
    setUserChatEntity: (state, { payload }: { payload: IChatSlice }) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});

export const { setUserChatEntity } = ChatSlice.actions;

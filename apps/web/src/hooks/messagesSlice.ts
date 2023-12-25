import { RootState } from '@/global/store';
import { createSlice } from '@reduxjs/toolkit';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

export interface IChatDetails {
  messages: MessageEntity[] | undefined;
}

const initialState: Partial<IChatDetails> = {
  messages: [],
};

export const chatDetailsSlice = createSlice({
  name: 'chat-details',
  initialState,
  reducers: {
    addMessages: (state, { payload }: { payload: MessageEntity[] | undefined }) => {
      state.messages = payload;
    },
    addMessage: (state, { payload }: { payload: MessageEntity }) => {
      state.messages?.push(payload);
    },
  },
});

export const { addMessage, addMessages } = chatDetailsSlice.actions;
export const selectChatMessages = (state: RootState) => state.chatDetails.messages;

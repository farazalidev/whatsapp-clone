import { createSlice } from '@reduxjs/toolkit';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';

interface UserSliceInitialStateType {
  Me: UserEntity | undefined;
  chats: UserChatEntity[] | undefined;
  contacts: ContactEntity[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const initialState: UserSliceInitialStateType = {
  Me: undefined,
  chats: undefined,
  contacts: undefined,
  isLoading: true,
  isError: false,
};

export const UserSlice = createSlice({
  name: 'user_slice',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }: { payload: Partial<UserSliceInitialStateType> }) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});

export const { setUserInfo } = UserSlice.actions;

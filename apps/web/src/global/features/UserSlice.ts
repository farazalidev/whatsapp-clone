import { createSlice } from '@reduxjs/toolkit';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { RootState } from '../store';

interface UserSliceInitialStateType {
  Me: UserEntity | null;
  contacts: ContactEntity[];
  pid: string;
  isLoading: boolean;
  isError: boolean;
}

const initialState: UserSliceInitialStateType = {
  Me: null,
  contacts: [],
  isLoading: true,
  isError: false,
  pid: '',
};

export const UserSlice = createSlice({
  name: 'user_slice',
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: Partial<UserSliceInitialStateType> | undefined }) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});

export const { setUser } = UserSlice.actions;
export const selectUser = (state: RootState) => state.UserSlice;

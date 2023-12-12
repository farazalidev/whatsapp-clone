import { createSlice } from '@reduxjs/toolkit';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';

interface UserSliceInitialStateType {
  user: UserEntity | null;
  user_profile_img_src: string | null;
  chats: UserChatEntity[];
}

const initialState: UserSliceInitialStateType = {
  chats: [],
  user: null,
  user_profile_img_src: null,
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

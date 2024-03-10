import { createSlice } from '@reduxjs/toolkit';
import { UserEntity } from '@server/modules/user/entities/user.entity';

interface ICallSlice {
  isOpen: boolean;
  callType: 'offer' | 'answer' | undefined;
  callReceiver: UserEntity | undefined;
}

const initialState: ICallSlice = { isOpen: false, callType: undefined, callReceiver: undefined };

export const CallSlice = createSlice({
  name: 'callSlice',
  initialState,
  reducers: {
    openCallPanel: (state, { payload }: { payload: { callType: 'offer' | 'answer'; callReceiver: UserEntity | undefined } }) => {
      return {
        callType: payload.callType,
        isOpen: true,
        callReceiver: payload.callReceiver,
      };
    },
    closeCallPanel: (state) => {
      return {
        callType: undefined,
        isOpen: false,
        callReceiver: undefined,
      };
    },
  },
});

export const { closeCallPanel, openCallPanel } = CallSlice.actions;

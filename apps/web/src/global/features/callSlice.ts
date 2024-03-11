import { createSlice } from '@reduxjs/toolkit';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { CallMode } from '../../../../../shared/types/call.types';

interface ICallSlice {
  isOpen: boolean;
  callType: 'offer' | 'answer' | undefined;
  callReceiver: UserEntity | undefined;
  callMode: CallMode;
}

const initialState: ICallSlice = { isOpen: false, callType: undefined, callReceiver: undefined, callMode: undefined };

export const CallSlice = createSlice({
  name: 'callSlice',
  initialState,
  reducers: {
    openCallPanel: (state, { payload }: { payload: { callType: 'offer' | 'answer'; callReceiver: UserEntity | undefined; callMode: CallMode } }) => {
      return {
        callType: payload.callType,
        isOpen: true,
        callReceiver: payload.callReceiver,
        callMode: payload.callMode,
      };
    },
    closeCallPanel: (state) => {
      return {
        callType: undefined,
        isOpen: false,
        callReceiver: undefined,
        callMode: undefined,
      };
    },
  },
});

export const { closeCallPanel, openCallPanel } = CallSlice.actions;

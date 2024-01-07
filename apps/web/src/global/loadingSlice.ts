import { createSlice } from '@reduxjs/toolkit';

interface ILoadingInitialState {
  message_input_loading: boolean;
}

const initialState: ILoadingInitialState = {
  message_input_loading: false,
};

export const LoadingSlice = createSlice({
  name: 'loading-slice',
  initialState,
  reducers: {
    setLoading: (state, { payload }: { payload: Partial<ILoadingInitialState> }) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});

export const { setLoading } = LoadingSlice.actions;

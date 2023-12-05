import { createSlice } from '@reduxjs/toolkit';

interface sideBarOverlayInitState {
  show: boolean;
  selectedOverlay: number;
}

const initialState: sideBarOverlayInitState = {
  show: false,
  selectedOverlay: 0,
};

export const sideBarOverlaySlice = createSlice({
  name: 'sidebaroverlay',
  initialState,
  reducers: {
    setShow: (state, { payload }: { payload: boolean }) => {
      state.show = payload;
    },
    setSelectedOverlay: (state, { payload }: { payload: number }) => {
      state.selectedOverlay = payload;
    },
  },
});

export const { setSelectedOverlay, setShow } = sideBarOverlaySlice.actions;

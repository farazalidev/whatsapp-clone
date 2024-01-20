import { createSlice } from '@reduxjs/toolkit';

interface IOverlaySliceProps {
  DocumentOverlayIsOpen: boolean;
}

const initialState: IOverlaySliceProps = {
  DocumentOverlayIsOpen: false,
};

export const overlaySlice = createSlice({
  name: 'overlaySlice',
  initialState,
  reducers: {
    toggleDocumentOverlay: (state) => {
      state.DocumentOverlayIsOpen = !state.DocumentOverlayIsOpen;
    },
    closeOverlay: (state) => {
      state.DocumentOverlayIsOpen = false;
    },
  },
});

export const { toggleDocumentOverlay, closeOverlay } = overlaySlice.actions;

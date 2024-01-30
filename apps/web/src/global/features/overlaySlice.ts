import { createSlice } from '@reduxjs/toolkit';

interface IOverlaySliceProps {
  DocumentOverlayIsOpen: boolean;
  GalleryOverlayIsOpen: boolean;
}

const initialState: IOverlaySliceProps = {
  DocumentOverlayIsOpen: false,
  GalleryOverlayIsOpen: false,
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
    toggleGalleryOverlay: (state) => {
      state.GalleryOverlayIsOpen = !state.GalleryOverlayIsOpen;
    },
  },
});

export const { toggleDocumentOverlay, toggleGalleryOverlay, closeOverlay } = overlaySlice.actions;

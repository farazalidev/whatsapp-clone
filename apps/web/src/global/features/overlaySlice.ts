import { createSlice } from '@reduxjs/toolkit';

interface IOverlaySliceProps {
  DocumentOverlayIsOpen: boolean;
  GalleryOverlayIsOpen: boolean;
  voiceMessagePanelIsOpen: boolean;
}

const initialState: IOverlaySliceProps = {
  DocumentOverlayIsOpen: false,
  GalleryOverlayIsOpen: false,
  voiceMessagePanelIsOpen: false,
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
    toggleVoiceMessagePanelOverlay: (state) => {
      state.voiceMessagePanelIsOpen = !state.voiceMessagePanelIsOpen;
    },
  },
});

export const { toggleDocumentOverlay, toggleGalleryOverlay, closeOverlay, toggleVoiceMessagePanelOverlay } = overlaySlice.actions;

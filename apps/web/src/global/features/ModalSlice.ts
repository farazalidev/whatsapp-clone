import { createSlice } from '@reduxjs/toolkit';

interface initStatType {
  AddContactModalIsOpen: boolean;
  SendDocumentModalIsOpen: boolean;
}

const initialState: initStatType = {
  AddContactModalIsOpen: false,
  SendDocumentModalIsOpen: false,
};

export const modalSlice = createSlice({
  name: 'modalslice',
  initialState,
  reducers: {
    toggleAddContactModal: (state) => {
      state.AddContactModalIsOpen = !state.AddContactModalIsOpen;
    },
    toggleSendDocumentModal: (state) => {
      state.AddContactModalIsOpen = false;
      state.SendDocumentModalIsOpen = !state.SendDocumentModalIsOpen;
    },
  },
});

export const { toggleAddContactModal, toggleSendDocumentModal } = modalSlice.actions;

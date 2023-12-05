import { createSlice } from '@reduxjs/toolkit';

interface initStatType {
  AddContactModalIsOpen: boolean;
}

const initialState: initStatType = {
  AddContactModalIsOpen: false,
};

export const modalSlice = createSlice({
  name: 'modalslice',
  initialState,
  reducers: {
    toggleAddContactModal: (state) => {
      state.AddContactModalIsOpen = !state.AddContactModalIsOpen;
    },
  },
});

export const { toggleAddContactModal } = modalSlice.actions;

import { createSlice } from '@reduxjs/toolkit';

interface initStatType {
  AddContactModalIsOpen: boolean;
  SendDocumentModalIsOpen: boolean;
  instructionsModal: {
    isOpen: boolean;
    component: InstructionModalComponentType;
  };
}

export type InstructionModalComponentType = 'Audio Device Not found' | 'Audio Device Not supported' | 'Audio device Permission denied' | undefined;

const initialState: initStatType = {
  AddContactModalIsOpen: false,
  SendDocumentModalIsOpen: false,
  instructionsModal: {
    component: undefined,
    isOpen: false,
  },
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
    closeInstructionModal: (state) => {
      state.instructionsModal = {
        component: undefined,
        isOpen: false,
      };
    },
    openInstructionModal: (state, { payload }: { payload: InstructionModalComponentType }) => {
      state.instructionsModal = {
        component: payload,
        isOpen: true,
      };
    },
  },
});

export const { toggleAddContactModal, toggleSendDocumentModal, closeInstructionModal, openInstructionModal } = modalSlice.actions;

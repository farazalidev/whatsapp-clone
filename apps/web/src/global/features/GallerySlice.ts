import { createSlice } from '@reduxjs/toolkit';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

export interface MessageEntityGalleryExtended extends MessageEntity {
  url: string | undefined;
}

interface IGallerySlice {
  activeMediaMessage: MessageEntity | null;
  MediaMessages: MessageEntityGalleryExtended[];
}

const initialState: IGallerySlice = {
  activeMediaMessage: null,
  MediaMessages: [],
};

export const GallerySlice = createSlice({
  name: 'gallery-slice',
  initialState,
  reducers: {
    addThumbnails: (state, { payload }: { payload: { messages: MessageEntityGalleryExtended[] | undefined } }) => {
      if (payload.messages) {
        state.MediaMessages = payload.messages;
      }
    },
    setActiveGalleryMedia: (state, { payload }: { payload: MessageEntity }) => {
      state.activeMediaMessage = payload;
    },
  },
});

export const { addThumbnails, setActiveGalleryMedia } = GallerySlice.actions;

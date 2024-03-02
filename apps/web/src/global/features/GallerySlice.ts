import { createSlice } from '@reduxjs/toolkit';
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity';

export interface MessageEntityGalleryExtended extends MessageMediaEntity {
  url: string | undefined;
}

interface IGallerySlice {
  activeMediaMessage: MessageMediaEntity | null;
  messages: { chat_id: string; mediaMessages: Set<MessageEntityGalleryExtended> }[];
}

const initialState: IGallerySlice = {
  activeMediaMessage: null,
  messages: [],
};

export const GallerySlice = createSlice({
  name: 'gallery-slice',
  initialState,
  reducers: {
    addThumbnails: (state, { payload }: { payload: addMediaThumbnailPayload | undefined }) => {
      console.log('🚀 ~ payload:', payload);
      if (payload?.chat_id && payload.messages) {
        const existedChat = state.messages.find((messages) => messages.chat_id === payload.chat_id);

        // if the chat existed and there are more media messages then we will add them
        if (existedChat) {
          return payload.messages.forEach((message) => existedChat.mediaMessages.add(message));
        }

        state.messages.push({ chat_id: payload?.chat_id, mediaMessages: new Set([...payload.messages]) });
      }
    },
    setActiveGalleryMedia: (state, { payload }: { payload: MessageMediaEntity }) => {
      state.activeMediaMessage = payload;
    },
  },
});

export const { addThumbnails, setActiveGalleryMedia } = GallerySlice.actions;

interface addMediaThumbnailPayload {
  chat_id: string | undefined;
  messages: MessageEntityGalleryExtended[];
}
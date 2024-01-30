import { IMediaThumbnail } from '@/components/User/Gallery/GalleryOverlay';
import { createSlice } from '@reduxjs/toolkit';

interface IGallerySlice {
  active_id: string | null;
  thumbnails: IMediaThumbnail[];
}

const initialState: IGallerySlice = {
  active_id: null,
  thumbnails: [],
};

export const GallerySlice = createSlice({
  name: 'gallery-slice',
  initialState,
  reducers: {
    addThumbnails: (state, { payload }: { payload: { thumbnails: IMediaThumbnail[] | undefined } }) => {
      if (payload.thumbnails) {
        state.thumbnails = payload.thumbnails;
      }
    },
    setActiveGalleryMedia: (state, { payload }: { payload: string }) => {
      state.active_id = payload;
    },
  },
});

export const { addThumbnails, setActiveGalleryMedia } = GallerySlice.actions;

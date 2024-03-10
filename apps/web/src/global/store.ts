import { configureStore } from '@reduxjs/toolkit';
import { sideBarOverlaySlice } from './features/SideBarOverlaySlice';
import { modalSlice } from './features/ModalSlice';
import { UserSlice } from './features/UserSlice';
import { ChatSlice } from './features/ChatSlice';
import { messagesSlice } from './features/messagesSlice';
import { LoadingSlice } from './loadingSlice';
import { overlaySlice } from './features/overlaySlice';
import { filesSlice } from './features/filesSlice';
import { GallerySlice } from './features/GallerySlice';
import ProfilePreviewSlice from './features/ProfilePreviewSlice';
import { CallSlice } from './features/callSlice';

export const store = configureStore({
  reducer: {
    sideBarOverlaySlice: sideBarOverlaySlice.reducer,
    modalSlice: modalSlice.reducer,
    UserSlice: UserSlice.reducer,
    ChatSlice: ChatSlice.reducer,
    messagesSlice: messagesSlice.reducer,
    overlaySlice: overlaySlice.reducer,
    GallerySlice: GallerySlice.reducer,
    filesSlice: filesSlice.reducer,
    LoadingSlice: LoadingSlice.reducer,
    ProfilePreviewSlice: ProfilePreviewSlice.reducer,
    CallSlice: CallSlice.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({ serializableCheck: false });
  },
  devTools: true,
});

//  Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

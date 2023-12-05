import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apis/ApiSlice';
import { sideBarOverlaySlice } from './features/SideBarOverlaySlice';
import { modalSlice } from './features/ModalSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    sideBarOverlaySlice: sideBarOverlaySlice.reducer,
    modalSlice: modalSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
  devTools: true,
});

//  Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

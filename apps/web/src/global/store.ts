import { configureStore } from '@reduxjs/toolkit';
import { AuthApi } from './apis/AuthApi';

export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(AuthApi.middleware);
  },
  devTools: true,
});

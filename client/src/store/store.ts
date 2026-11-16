import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import uiReducer from './slices/uiSlice';
import tenantReducer from './slices/tenantSlice';
import gamificationReducer from './slices/gamificationSlice';
import certificateReducer from './slices/certificateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    course: courseReducer,
    ui: uiReducer,
    tenant: tenantReducer,
    gamification: gamificationReducer,
    certificate: certificateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

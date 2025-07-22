import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bloodAvailabilityReducer from './slices/bloodAvailabilitySlice';
import hospitalReducer from './slices/hospitalSlice';
import bloodBankReducer from './slices/bloodBankSlice';
import bloodRequestReducer from './slices/bloodRequestSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bloodAvailability: bloodAvailabilityReducer,
    hospitals: hospitalReducer,
    bloodBanks: bloodBankReducer,
    bloodRequests: bloodRequestReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

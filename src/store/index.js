import { configureStore } from '@reduxjs/toolkit';
import treeReducer from '../utils/treeSlice';

export const store = configureStore({
  reducer: {
    calcTree: treeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

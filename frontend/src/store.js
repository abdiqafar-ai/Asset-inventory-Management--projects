import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import assetReducer from './reducers/assetReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetReducer,
  },
});

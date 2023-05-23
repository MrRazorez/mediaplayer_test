import { configureStore } from '@reduxjs/toolkit';
import songReducer from './songSlice';

const store = configureStore({
  reducer: {
    song: songReducer,
  },
});

export default store;

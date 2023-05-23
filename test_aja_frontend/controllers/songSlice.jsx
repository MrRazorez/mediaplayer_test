import { createSlice } from '@reduxjs/toolkit';

export const songSlice = createSlice({
  name: 'song',
  initialState: {
    value: '',
  },
  reducers: {
    selectSong: (state, action) => {
      state.value = action.payload
    },
  },
});

export const { selectSong } = songSlice.actions;

export default songSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likedSongs: []
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    addSong: (state, action) => {
      state.likedSongs.push(action.payload);
      console.log(action);
    },
    removeSong: (state, action) => {
      state.likedSongs = state.likedSongs.filter(song => song.id !== action.payload.id);
    },
    updateSong: (state, action) => {
      const index = state.likedSongs.findIndex(song => song.id === action.payload.id);
      if (index !== -1) {
        state.likedSongs[index] = action.payload;
      }
    }
  }
});

export const { addSong, removeSong, updateSong } = songsSlice.actions;

export default songsSlice.reducer;

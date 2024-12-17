// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import songslice from '../features/songs/songslice';


const store = configureStore({
  reducer: {
    songs: songslice
  },
  
});



export default store;

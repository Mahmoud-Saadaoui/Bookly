import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { bookReducer } from './slices/bookSlice';
import { favoritesReducer } from './slices/favoriteSlice';
import loanReducer from './slices/loanSlice';

const store = configureStore({
    reducer: {
       auth: authReducer, 
       book: bookReducer,
       favorites: favoritesReducer,
       loan: loanReducer,
    }
});

export default store
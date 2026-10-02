import { createSlice } from "@reduxjs/toolkit";

const getBookId = (favorite) => favorite?.book?.id || favorite?.book?._id;

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favoriteList: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFavorites(state, action) {
      state.favoriteList = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    addToFavorites(state, action) {
      state.favoriteList = [...state.favoriteList, action.payload];
    },
    removeFromFavorites(state, action) {
      state.favoriteList = state.favoriteList.filter(
        (favorite) => getBookId(favorite) !== action.payload
      );
    },
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

const favoritesReducer = favoritesSlice.reducer;
const favoritesActions = favoritesSlice.actions;

export { favoritesReducer, favoritesActions };

import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
    name: "favoriteList",
    initialState: {
        favoriteList: [],
        loading: false,
    },
    reducers: {
        setFavorites(state, action) {
            state.favoriteList = action.payload
        },
        addToFavorites(state, action) {
            state.favoriteList.push(action.payload)
        },
        removeFromFavorites(state, action) {
            state.favoriteList = state.favoriteList.filter(el => el.book?.id !== action.payload)
        },
        setLoading(state) {
            state.loading = true;
        },
        clearLoading(state) {
            state.loading = false;
        },
    }
})

const favoritesReducer = favoritesSlice.reducer;
const favoritesActions = favoritesSlice.actions;

export {favoritesReducer, favoritesActions}
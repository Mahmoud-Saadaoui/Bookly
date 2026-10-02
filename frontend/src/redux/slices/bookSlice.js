import { createSlice } from "@reduxjs/toolkit";

const emptyPagination = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
};

const initialState = {
  books: {
    data: [],
    pagination: emptyPagination,
  },
  selectedBook: null,
  reviews: {
    data: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    },
  },
  error: null,
  loading: false,
  reviewsLoading: false,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    getBooks(state, action) {
      state.books = action.payload;
      state.error = null;
    },
    findBook(state, action) {
      state.selectedBook = action.payload;
      state.error = null;
    },
    getReviews(state, action) {
      state.reviews = action.payload;
      state.error = null;
    },
    appendReviews(state, action) {
      state.reviews = {
        ...action.payload,
        data: [...state.reviews.data, ...action.payload.data],
      };
      state.error = null;
    },
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setReviewsLoading(state) {
      state.reviewsLoading = true;
    },
    clearReviewsLoading(state) {
      state.reviewsLoading = false;
    },
    setError(state, action) {
      state.error = action.payload || "An unexpected error occurred";
    },
    clearError(state) {
      state.error = null;
    },
    addBook(state, action) {
      state.books.data = [action.payload, ...state.books.data];
    },
    deleteBook(state, action) {
      state.books.data = state.books.data.filter((book) => book.id !== action.payload);
    },
    updateBook(state, action) {
      state.books.data = state.books.data.map((book) => (
        book.id === action.payload.id ? { ...book, ...action.payload } : book
      ));

      if (state.selectedBook?.id === action.payload.id) {
        state.selectedBook = { ...state.selectedBook, ...action.payload };
      }
    },
  },
});

const bookReducer = bookSlice.reducer;
const bookActions = bookSlice.actions;

export { bookActions, bookReducer };

import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    reviews: [],
    error: false,
    loading: false,
  },
  reducers: {
    getBooks(state, action) {
      state.books = action.payload;
    },
    findBook(state, action) {
      state.books = action.payload;
    },
    addReview(state, action) {
      if (Array.isArray(state.books)) {
        const bookIndex = state.books.findIndex(b => b.id === action.payload.bookId);
        if (bookIndex !== -1) {
          state.books[bookIndex].reviews.push(action.payload.review);
        }
      }
    },
    getReviews(state, action) {
      state.reviews = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setError(state) {
      state.error = true;
    },
    clearError(state) {
      state.error = false;
    },
    addBook(state, action) {
      state.books = [...state.books, action.payload];
    },
    deleteBook(state, action) {
      if (Array.isArray(state.books)) {
        state.books = state.books.filter(el => el.id !== action.payload);
      } else if (state.books.data) {
        state.books.data = state.books.data.filter(el => el.id !== action.payload);
      }
    },
    updateBook(state, action) {
      if (Array.isArray(state.books)) {
        state.books = state.books.map((book) =>
          book.id === action.payload.id ? action.payload : book
        );
      } else if (state.books.data) {
        state.books.data = state.books.data.map((book) =>
          book.id === action.payload.id ? action.payload : book
        );
      }
    }
  }
});

const bookReducer = bookSlice.reducer;
const bookActions = bookSlice.actions;

export { bookActions, bookReducer };

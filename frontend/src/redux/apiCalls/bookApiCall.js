import axios from "axios";
import { toast } from "react-toastify";
import { bookActions } from "../slices/bookSlice";
import { BASE_URL, BOOK_URL } from "../../constantes";

// Get All Books
export function fetchBooks(page) {
  return async (dispatch) => {
    try {
      dispatch(bookActions.setLoading())
      const { data } = await axios.get(`${BASE_URL}/books?page=${page+1}`);
      dispatch(bookActions.getBooks(data));
      dispatch(bookActions.clearLoading())
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.msg || "Failed to fetch books";
      toast.error(errorMessage);
      dispatch(bookActions.clearLoading());
    }
  };
}

// Get Book By Id
export function fetchSingleBook(bookId) {
  return async (dispatch, getState) => {
    try {
      dispatch(bookActions.setLoading())
      const { data } = await axios.get(`${BOOK_URL}/${bookId}`, {
        headers: {
          "authorization": getState().auth.user.accessToken
        }
      });
      // Store the book data from response
      dispatch(bookActions.findBook(data.success ? data.data : data));
      dispatch(bookActions.clearLoading());
    } catch (error) {
      toast.error(error.response?.data.message);
      dispatch(bookActions.clearLoading());
    }
  };
}

// Get Book Reviews
export function getBookReviews(bookId) {
  return async (dispatch, getState) => {
    try {
      dispatch(bookActions.setLoading())
      const {data} = await axios.get(`${BOOK_URL}/${bookId}/reviews`, {
        headers: {
          "authorization": getState().auth.user.accessToken
        }
      });
      dispatch(bookActions.getReviews(data));
      dispatch(bookActions.clearLoading());
    } catch (error) {
      toast.error(error?.response?.data.message);
      dispatch(bookActions.clearLoading());
    }
  };
}

// Post Review
export function postReview(bookId, review) {
  return async (dispatch, getState) => {
    try {
      dispatch(bookActions.setLoading())
      const {data} = await axios.post(`${BOOK_URL}/${bookId}/reviews`, review, {
        headers: {
          "authorization": getState().auth.user.accessToken
        }
      });
      toast.success(data?.message || "Review added successfully")
      dispatch(getBookReviews(bookId));
      dispatch(bookActions.clearLoading());
      return data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to add review";
      toast.error(errorMessage);
      dispatch(bookActions.clearLoading());
      throw error;
    }
  };
}

// Add Book
export function addBook(newBook) {
  return async (dispatch, getState) => {
    try {
      dispatch(bookActions.setLoading())
      const {data} = await axios.post(`${BOOK_URL}`, newBook, {
        headers: {
          "authorization": getState().auth.user.accessToken,
          "Content-Type": "multipart/form-data",
        }
      });
      toast.success(data?.message || "Book created successfully");
      // Add the new book to the state
      if (data?.data) {
        dispatch(bookActions.addBook(data.data));
      }
      dispatch(bookActions.clearLoading());
      return data;
    } catch (error) {
      let errorMessage = "Failed to create book";
      const response = error?.response?.data;

      if (response?.errors && Array.isArray(response.errors)) {
        // Show first validation error
        errorMessage = response.errors[0]?.message || errorMessage;
      } else if (response?.message) {
        errorMessage = response.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      dispatch(bookActions.clearLoading());
      throw error;
    }
  };
}

// Remove Book
export function removeBook(bookId) {
  return async (dispatch, getState) => {
    try {
      dispatch(bookActions.setLoading())
      const {data} = await axios.delete(`${BOOK_URL}/${bookId}`, {
        headers: {
          "authorization": getState().auth.user.accessToken
        }
      });
      toast.success(data.message)
      dispatch(bookActions.deleteBook(data.bookId))
      dispatch(bookActions.clearLoading());
    } catch (error) {
      toast.error(error?.response?.data.message);
      dispatch(bookActions.clearLoading());
    }
  };
}

// Update Book Image
export function updateBookImage(image, bookId) {
  return async (dispatch, getState) => {
    try {
      dispatch(bookActions.setLoading())
      const {data} = await axios.put(`${BOOK_URL}/update-image/${bookId}`, image, {
        headers: {
          "authorization": getState().auth.user.accessToken,
          "Content-Type": "multipart/form-data",
        }
      });
      toast.success(data?.message)
      dispatch(bookActions.updateBook(data.data))
      dispatch(bookActions.clearLoading());
    } catch (error) {
      toast.error(error?.response?.data.message);
      dispatch(bookActions.clearLoading());
    }
  };
}

// Update Book Form
export function updateBookForm(form, bookId) {
  return async (dispatch, getState) => {
    try {
      dispatch(bookActions.setLoading())
      const {data} = await axios.put(`${BOOK_URL}/${bookId}`, form, {
        headers: {
          "authorization": getState().auth.user.accessToken,
        }
      });
      toast.success(data.message)
      dispatch(bookActions.updateBook(data.data))
      dispatch(bookActions.clearLoading());
    } catch (error) {
      toast.error(error?.response?.data.message);
      dispatch(bookActions.clearLoading());
    }
  };
}
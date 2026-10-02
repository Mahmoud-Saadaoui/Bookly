import { toast } from "react-toastify";
import { bookActions } from "../slices/bookSlice";
import api from "../../services/axiosInstance";
import {
  getApiErrorMessage,
  normalizeBook,
  normalizeBooksResponse,
  normalizeReviewsResponse,
} from "../../lib/normalize";

const handleBookError = (dispatch, error, fallback) => {
  const message = getApiErrorMessage(error, fallback);
  dispatch(bookActions.setError(message));
  toast.error(message);
};

export function fetchBooks(page = 1, filters = {}) {
  return async (dispatch) => {
    dispatch(bookActions.setLoading());

    try {
      const params = new URLSearchParams({
        page: String(Math.max(Number(page) || 1, 1)),
        limit: String(filters.limit || 10),
      });

      if (filters.q?.trim()) params.set("q", filters.q.trim());
      if (filters.category && filters.category !== "All") {
        params.set("category", filters.category);
      }

      const { data } = await api.get(`/books?${params.toString()}`);
      dispatch(bookActions.getBooks(normalizeBooksResponse(data)));
      return data;
    } catch (error) {
      handleBookError(dispatch, error, "Failed to fetch books");
      return null;
    } finally {
      dispatch(bookActions.clearLoading());
    }
  };
}

export function fetchSingleBook(bookId) {
  return async (dispatch) => {
    dispatch(bookActions.setLoading());

    try {
      const { data } = await api.get(`/books/${bookId}`);
      const book = normalizeBook(data.data);
      dispatch(bookActions.findBook(book));
      return book;
    } catch (error) {
      handleBookError(dispatch, error, "Failed to fetch book");
      return null;
    } finally {
      dispatch(bookActions.clearLoading());
    }
  };
}

export async function fetchBookCategories() {
  const { data } = await api.get('/books/categories');
  return data.success && Array.isArray(data.data) ? data.data : [];
}

export const findBook = fetchSingleBook;

export function getBookReviews(bookId, page = 1, append = false) {
  return async (dispatch) => {
    dispatch(bookActions.setReviewsLoading());

    try {
      const { data } = await api.get(`/books/${bookId}/reviews`, {
        params: { page, limit: 20 },
      });
      const reviews = normalizeReviewsResponse(data);
      dispatch(append ? bookActions.appendReviews(reviews) : bookActions.getReviews(reviews));
      return reviews;
    } catch (error) {
      handleBookError(dispatch, error, "Failed to fetch reviews");
      return null;
    } finally {
      dispatch(bookActions.clearReviewsLoading());
    }
  };
}

export function postReview(bookId, review) {
  return async (dispatch) => {
    try {
      const { data } = await api.post(`/books/${bookId}/reviews`, review);
      toast.success(data.message || "Review added successfully");
      await dispatch(getBookReviews(bookId));
      return data;
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to add review");
      toast.error(message);
      throw error;
    }
  };
}

export function addBook(formData) {
  return async (dispatch) => {
    dispatch(bookActions.setLoading());

    try {
      const { data } = await api.post("/books", formData);
      const book = normalizeBook(data.data);
      dispatch(bookActions.addBook(book));
      toast.success(data.message || "Book created successfully");
      return data;
    } catch (error) {
      handleBookError(dispatch, error, "Failed to create book");
      throw error;
    } finally {
      dispatch(bookActions.clearLoading());
    }
  };
}

export function removeBook(bookId) {
  return async (dispatch) => {
    dispatch(bookActions.setLoading());

    try {
      const { data } = await api.delete(`/books/${bookId}`);
      dispatch(bookActions.deleteBook(data.data?.bookId || bookId));
      toast.success(data.message || "Book deleted successfully");
      return data;
    } catch (error) {
      handleBookError(dispatch, error, "Failed to delete book");
      throw error;
    } finally {
      dispatch(bookActions.clearLoading());
    }
  };
}

export function updateBookForm(form, bookId) {
  return async (dispatch) => {
    dispatch(bookActions.setLoading());

    try {
      const { data } = await api.put(`/books/${bookId}`, form);
      const book = normalizeBook(data.data);
      dispatch(bookActions.updateBook(book));
      toast.success(data.message || "Book updated successfully");
      return data;
    } catch (error) {
      handleBookError(dispatch, error, "Failed to update book");
      throw error;
    } finally {
      dispatch(bookActions.clearLoading());
    }
  };
}

export const updateBook = updateBookForm;

export function updateBookImage(formData, bookId) {
  return async (dispatch) => {
    dispatch(bookActions.setLoading());

    try {
      const { data } = await api.put(`/books/update-image/${bookId}`, formData);
      const book = normalizeBook(data.data);
      dispatch(bookActions.updateBook(book));
      toast.success(data.message || "Image updated successfully");
      return data;
    } catch (error) {
      handleBookError(dispatch, error, "Failed to update image");
      throw error;
    } finally {
      dispatch(bookActions.clearLoading());
    }
  };
}

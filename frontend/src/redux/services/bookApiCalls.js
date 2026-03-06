import { toast } from "react-toastify";
import { bookActions } from "../slices/bookSlice";
import axios from "axios";
import { BOOK_URL } from "../../constants";

const api = axios.create({
  baseURL: BOOK_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const token = JSON.parse(userInfo).accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch all books
export function fetchBooks(page = 0) {
  return async (dispatch) => {
    try {
      dispatch(bookActions.setLoading());
      const { data } = await api.get(`?page=${page}`);

      if (data.success) {
        // Store full response including pagination metadata
        dispatch(bookActions.getBooks({
          data: data.data,
          pagination: data.pagination
        }));
        dispatch(bookActions.clearLoading());
      } else {
        dispatch(bookActions.setError());
        dispatch(bookActions.clearLoading());
        toast.error(data.message || 'Failed to fetch books');
      }
    } catch (error) {
      dispatch(bookActions.setError());
      dispatch(bookActions.clearLoading());
      const message = error.response?.data?.message || 'Failed to fetch books';
      toast.error(message);
      throw error;
    }
  };
}

// Find a book by ID
export function findBook(id) {
  return async (dispatch) => {
    try {
      dispatch(bookActions.setLoading());
      const { data } = await api.get(`/${id}`);

      if (data.success) {
        dispatch(bookActions.findBook(data.data));
        dispatch(bookActions.clearLoading());
      } else {
        dispatch(bookActions.setError());
        dispatch(bookActions.clearLoading());
        toast.error(data.message || 'Failed to fetch book');
      }
    } catch (error) {
      dispatch(bookActions.setError());
      dispatch(bookActions.clearLoading());
      const message = error.response?.data?.message || 'Failed to fetch book';
      toast.error(message);
      throw error;
    }
  };
}

// Add a new book (admin only)
export function addBook(formData) {
  return async (dispatch) => {
    try {
      dispatch(bookActions.setLoading());

      const userInfo = localStorage.getItem("userInfo");
      const token = userInfo ? JSON.parse(userInfo).accessToken : null;

      const { data } = await axios.post(`${BOOK_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (data.success) {
        dispatch(bookActions.addBook(data.data));
        dispatch(bookActions.clearLoading());
        toast.success(data.message || 'Book added successfully');
        return data;
      } else {
        dispatch(bookActions.setError());
        dispatch(bookActions.clearLoading());
        toast.error(data.message || 'Failed to add book');
        return null;
      }
    } catch (error) {
      dispatch(bookActions.setError());
      dispatch(bookActions.clearLoading());
      const message = error.response?.data?.message || 'Failed to add book';
      toast.error(message);
      throw error;
    }
  };
}

// Update a book (admin only)
export function updateBook(id, formData) {
  return async (dispatch) => {
    try {
      dispatch(bookActions.setLoading());

      const userInfo = localStorage.getItem("userInfo");
      const token = userInfo ? JSON.parse(userInfo).accessToken : null;

      const { data } = await axios.put(`${BOOK_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (data.success) {
        dispatch(bookActions.updateBook({ id, ...data.data }));
        dispatch(bookActions.clearLoading());
        toast.success(data.message || 'Book updated successfully');
        return data;
      } else {
        dispatch(bookActions.setError());
        dispatch(bookActions.clearLoading());
        toast.error(data.message || 'Failed to update book');
        return null;
      }
    } catch (error) {
      dispatch(bookActions.setError());
      dispatch(bookActions.clearLoading());
      const message = error.response?.data?.message || 'Failed to update book';
      toast.error(message);
      throw error;
    }
  };
}

// Delete a book (admin only)
export function removeBook(id) {
  return async (dispatch) => {
    try {
      dispatch(bookActions.setLoading());

      const userInfo = localStorage.getItem("userInfo");
      const token = userInfo ? JSON.parse(userInfo).accessToken : null;

      const { data } = await axios.delete(`${BOOK_URL}/${id}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (data.success) {
        dispatch(bookActions.deleteBook(id));
        dispatch(bookActions.clearLoading());
        toast.success(data.message || 'Book deleted successfully');
      } else {
        dispatch(bookActions.setError());
        dispatch(bookActions.clearLoading());
        toast.error(data.message || 'Failed to delete book');
      }
    } catch (error) {
      dispatch(bookActions.setError());
      dispatch(bookActions.clearLoading());
      const message = error.response?.data?.message || 'Failed to delete book';
      toast.error(message);
      throw error;
    }
  };
}

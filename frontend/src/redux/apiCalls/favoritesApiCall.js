import { favoritesActions } from "../slices/favoriteSlice";
import { toast } from "react-toastify";
import api from "../../services/axiosInstance";
import { getApiErrorMessage } from "../../lib/normalize";

const handleFavoriteError = (error, fallback) => {
  const message = getApiErrorMessage(error, fallback);
  toast.error(message);
};

export function getFavorites() {
  return async (dispatch) => {
    dispatch(favoritesActions.setLoading());

    try {
      const { data } = await api.get("/favoriteList");
      dispatch(favoritesActions.setFavorites(data.data || []));
      return data.data || [];
    } catch (error) {
      handleFavoriteError(error, "Failed to load favorites");
      return [];
    } finally {
      dispatch(favoritesActions.clearLoading());
    }
  };
}

export function postToFavorites(bookId) {
  return async (dispatch) => {
    dispatch(favoritesActions.setLoading());

    try {
      const { data } = await api.post("/favoriteList", {
        book: bookId,
        favorite: true,
      });
      dispatch(favoritesActions.setFavorites(data.data || []));
      toast.success(data.message || "Book added to favorites");
      return data.data || [];
    } catch (error) {
      handleFavoriteError(error, "Failed to add favorite");
      return [];
    } finally {
      dispatch(favoritesActions.clearLoading());
    }
  };
}

export function removeFromFavorites(bookId) {
  return async (dispatch) => {
    dispatch(favoritesActions.setLoading());

    try {
      const { data } = await api.delete(`/favoriteList/${bookId}`);
      dispatch(favoritesActions.setFavorites(data.data || []));
      toast.success(data.message || "Book removed from favorites");
      return data.data || [];
    } catch (error) {
      handleFavoriteError(error, "Failed to remove favorite");
      return [];
    } finally {
      dispatch(favoritesActions.clearLoading());
    }
  };
}

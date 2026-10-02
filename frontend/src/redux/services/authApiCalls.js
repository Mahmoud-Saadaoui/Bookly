import { toast } from "react-toastify";
import { authActions } from "../slices/authSlice";
import api, { getStoredUser } from "../../services/axiosInstance";

const persistUser = (user) => {
  localStorage.setItem("userInfo", JSON.stringify(user));
};

// Login User
export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await api.post('/users/login', user);

      if (data.success) {
        dispatch(authActions.login(data.data));
        dispatch(authActions.setHydrated());
        persistUser(data.data);
        toast.success(data.message || 'Login successful');
        return data.data;
      } else {
        toast.error(data.message || 'Login failed');
        return null;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };
}

// Register User
export function registerUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await api.post('/users/register', user);

      if (data.success) {
        dispatch(authActions.login(data.data));
        dispatch(authActions.setHydrated());
        persistUser(data.data);
        toast.success(data.message || 'Registration successful');
        return data.data;
      } else {
        toast.error(data.message || 'Registration failed');
        return null;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };
}

export function getCurrentUser() {
  return async (dispatch) => {
    const storedUser = getStoredUser();
    if (!storedUser?.accessToken) {
      dispatch(authActions.setHydrated());
      return null;
    }

    try {
      const { data } = await api.get('/users/me');
      const user = { ...storedUser, ...data.data, id: data.data?.id || data.data?._id };
      dispatch(authActions.login(user));
      persistUser(user);
      dispatch(authActions.setHydrated());
      return user;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(authActions.logout());
        localStorage.removeItem("userInfo");
      }
      dispatch(authActions.setHydrated());
      return null;
    }
  };
}

// Logout User
export function logoutUser() {
  return (dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("userInfo");
    toast.info('Logged out successfully');
  };
}

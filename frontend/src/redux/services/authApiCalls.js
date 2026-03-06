import { toast } from "react-toastify";
import { authActions } from "../slices/authSlice";
import axios from "axios";
import { USER_URL } from "../../constants";

const api = axios.create({
  baseURL: USER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';

    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem("userInfo");
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Login User
export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await api.post('/login', user);

      if (data.success) {
        dispatch(authActions.login(data.data));
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        toast.success(data.message || 'Login successful');
      } else {
        toast.error(data.message || 'Login failed');
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
      const { data } = await api.post('/register', user);

      if (data.success) {
        dispatch(authActions.login(data.data));
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        toast.success(data.message || 'Registration successful');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
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

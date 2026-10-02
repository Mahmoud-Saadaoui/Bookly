import axios from "axios";
import { BASE_URL } from "../constants";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getStoredUser = () => {
  try {
    const value = localStorage.getItem("userInfo");
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem("userInfo");
    return null;
  }
};

export const getAuthToken = () => getStoredUser()?.accessToken || null;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = ['/login', '/register'].some((path) =>
      error.config?.url?.endsWith(path)
    );

    if (error.response?.status === 401 && !isAuthRequest) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem("userInfo");
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

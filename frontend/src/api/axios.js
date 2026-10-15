import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fleetly_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors.
// A 401 only means "expired session" when we actually sent a token: public
// pages (catalogue, vehicle details) must never be redirected to /login just
// because one of their requests was unauthenticated. Protected pages are
// already guarded by ProtectedRoute.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = Boolean(localStorage.getItem('fleetly_token'));
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('fleetly_token');
      localStorage.removeItem('fleetly_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

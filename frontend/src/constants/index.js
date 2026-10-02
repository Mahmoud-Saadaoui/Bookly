const DEFAULT_PRODUCTION_URL = 'https://bookly-1rvp.onrender.com/api';
const DEFAULT_DEVELOPMENT_URL = 'http://localhost:5000/api';

const sanitizeUrl = (url) => (url || '').replace(/\/+$/, '');

const configuredUrl = import.meta.env.VITE_API_URL;
const fallbackUrl = import.meta.env.PROD
  ? DEFAULT_PRODUCTION_URL
  : DEFAULT_DEVELOPMENT_URL;

export const BASE_URL = sanitizeUrl(configuredUrl || fallbackUrl);
export const USER_URL = `${BASE_URL}/users`;
export const BOOK_URL = `${BASE_URL}/books`;
export const FAVORITES_URL = `${BASE_URL}/favoriteList`;
export const LOANS_URL = `${BASE_URL}/loans`;
export const CONFIG_URL = `${BASE_URL}/config`;

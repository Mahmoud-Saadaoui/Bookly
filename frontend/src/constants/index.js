const PRODUCTION_URL = 'https://bookly-1rvp.onrender.com/api';
const DEVELOPMENT_URL = 'http://localhost:5000/api';

function sanitizeDomain(domain) {
  if (!domain) return '';
  return domain.endsWith('/') ? domain.slice(0, -1) : domain;
}

const prodDomain = sanitizeDomain(PRODUCTION_URL);
const devDomain = sanitizeDomain(DEVELOPMENT_URL);

export const BASE_URL = prodDomain ;
export const USER_URL = `${BASE_URL}/users`;
export const BOOK_URL = `${BASE_URL}/books`;
export const FAVORITES_URL = `${BASE_URL}/favoriteList`;
export const LOANS_URL = `${BASE_URL}/loans`;

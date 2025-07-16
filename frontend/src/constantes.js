function sanitizeDomain(domain) {
  if (!domain) return "";
  return domain.endsWith("/") ? domain.slice(0, -1) : domain;
}

const prodDomain = sanitizeDomain(process.env.REACT_APP_API_PRODUCTION_URL)
const devDomain = sanitizeDomain(process.env.REACT_APP_API_URL)

const BASE = `${process.env.NODE_ENV === "production" ? prodDomain : devDomain}`
console.log(process.env.NODE_ENV)

export const BASE_URL = BASE;
export const USER_URL = `${BASE}/users`;
export const BOOK_URL = `${BASE}/books`;
export const FAVORITES_URL = `${BASE}/favoriteList`;
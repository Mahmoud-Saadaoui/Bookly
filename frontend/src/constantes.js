const env = 'development' //process.env.NODE_ENV
const PRODUCTION_URL = 'https://bookly-1rvp.onrender.com/api'
const DEVELOPMENT_URL = 'http://localhost:5001/api'

function sanitizeDomain(domain) {
  if (!domain) return "";
  return domain.endsWith("/") ? domain.slice(0, -1) : domain;
}

const prodDomain = sanitizeDomain(PRODUCTION_URL)
const devDomain = sanitizeDomain(DEVELOPMENT_URL)

const BASE = `${env === "production" ? prodDomain : devDomain}`
console.log(process.env.NODE_ENV)

export const BASE_URL = BASE;
export const USER_URL = `${BASE}/users`;
export const BOOK_URL = `${BASE}/books`;
export const FAVORITES_URL = `${BASE}/favoriteList`;
export const LOANS_URL = `${BASE}/loans`;
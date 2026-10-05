const { OAuth2Client } = require('google-auth-library');

/**
 * Google OAuth2 Authentication Service
 * 
 * This module handles the OAuth2 flow with Google:
 * 1. Generate consent URL redirecting to Google
 * 2. Exchange authorization code for user profile
 */

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback';

// Google OAuth2 client
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL);

/**
 * Generates the Google consent URL
 * User is redirected to this URL to authorize the application
 * 
 * @returns {string} Google consent URL
 */
function getGoogleAuthUrl() {
  return client.generateAuthUrl({
    access_type: 'online',
    scope: ['profile', 'email'],
    prompt: 'select_account'
  });
}

/**
 * Exchanges authorization code for a Google profile
 * 
 * @param {string} code - Authorization code returned by Google
 * @returns {Promise<Object>} Google profile { sub, email, name, picture }
 * @throws {Error} If exchange fails or email is not verified
 */
async function getGoogleProfile(code) {
  // Exchange code for tokens
  const { tokens } = await client.getToken(code);
  
  // Verify ID token and get profile
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: CLIENT_ID
  });

  const payload = ticket.getPayload();

  // Verify email is verified by Google
  if (!payload.email_verified) {
    throw new Error('Google email is not verified');
  }

  return {
    sub: payload.sub,        // Unique Google identifier
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  };
}

module.exports = {
  getGoogleAuthUrl,
  getGoogleProfile
};

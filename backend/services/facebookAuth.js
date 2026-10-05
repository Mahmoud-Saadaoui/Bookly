const axios = require('axios');

/**
 * Facebook OAuth2 Authentication Service
 * 
 * This module handles the OAuth2 flow with Facebook:
 * 1. Generate consent URL redirecting to Facebook
 * 2. Exchange authorization code for user profile
 */

const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5001/api/auth/facebook/callback';

/**
 * Generates the Facebook consent URL
 * User is redirected to this URL to authorize the application
 * 
 * @returns {string} Facebook consent URL
 */
function getFacebookAuthUrl() {
  const params = new URLSearchParams({
    client_id: APP_ID,
    redirect_uri: CALLBACK_URL,
    scope: 'email,public_profile',
    response_type: 'code'
  });
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

/**
 * Exchanges authorization code for a Facebook profile
 * 
 * @param {string} code - Authorization code returned by Facebook
 * @returns {Promise<Object>} Facebook profile { id, name, email, picture }
 * @throws {Error} If exchange fails
 */
async function getFacebookProfile(code) {
  // Step 1: Exchange code for access token
  const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
    params: {
      client_id: APP_ID,
      client_secret: APP_SECRET,
      redirect_uri: CALLBACK_URL,
      code
    }
  });

  const accessToken = tokenResponse.data.access_token;

  // Step 2: Get user profile
  const profileResponse = await axios.get('https://graph.facebook.com/me', {
    params: {
      access_token: accessToken,
      fields: 'id,name,email,picture.type(large)'
    }
  });

  const profile = profileResponse.data;

  // Verify email is present
  if (!profile.email) {
    throw new Error('Facebook email is not accessible');
  }

  return {
    id: profile.id,           // Unique Facebook identifier
    email: profile.email,
    name: profile.name,
    picture: profile.picture?.data?.url || null
  };
}

module.exports = {
  getFacebookAuthUrl,
  getFacebookProfile
};

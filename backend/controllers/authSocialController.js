const User = require('../models/user');
const jwtHelpers = require('../utils/jwtHelpers');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { successResponse, badRequestResponse } = require('../utils/apiResponse');
const { getGoogleAuthUrl, getGoogleProfile } = require('../services/googleAuth');
const { getFacebookAuthUrl, getFacebookProfile } = require('../services/facebookAuth');

/**
 * Handles OAuth2 callback for a given provider (Google or Facebook)
 * 
 * Flow:
 * 1. Get authorization code from query
 * 2. Exchange code for social profile
 * 3. Find or create user
 * 4. Generate JWT
 * 5. Return token + user
 * 
 * @param {string} provider - 'google' or 'facebook'
 * @returns {Function} Express handler
 */
const handleSocialCallback = (provider) => asyncHandler(async (req, res) => {
  const { code } = req.query;

  // Check code presence
  if (!code) {
    return badRequestResponse(res, 'Authorization code missing');
  }

  try {
    // Step 1: Get social profile based on provider
    const profile = provider === 'google'
      ? await getGoogleProfile(code)
      : await getFacebookProfile(code);

    // Step 2: Find existing user by email
    let user = await User.findOne({ email: profile.email });

    // Step 3: Create user if not exists
    if (!user) {
      const socialIdField = provider === 'google' ? 'googleId' : 'facebookId';
      user = await User.create({
        name: profile.name,
        email: profile.email,
        password: require('crypto').randomBytes(32).toString('hex'), // Random password (never used)
        role: 'customer',
        [socialIdField]: profile.sub || profile.id
      });
    } else {
      // User exists: update social ID if missing
      const socialIdField = provider === 'google' ? 'googleId' : 'facebookId';
      if (!user[socialIdField]) {
        user[socialIdField] = profile.sub || profile.id;
        await user.save();
      }
    }

    // Step 4: Generate JWT
    const token = jwtHelpers.sign({ sub: user._id });

    // Step 5: Return response
    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token
    }, 'Login successful');
  } catch (error) {
    // Handle specific errors
    if (error.message.includes('verified') || error.message.includes('accessible')) {
      return badRequestResponse(res, error.message);
    }
    throw error; // Other errors handled by global errorHandler
  }
});

/**
 * Redirects to Google for authentication
 * GET /api/auth/google
 */
const redirectToGoogle = (req, res) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
};

/**
 * Redirects to Facebook for authentication
 * GET /api/auth/facebook
 */
const redirectToFacebook = (req, res) => {
  const url = getFacebookAuthUrl();
  res.redirect(url);
};

module.exports = {
  handleSocialCallback,
  redirectToGoogle,
  redirectToFacebook
};

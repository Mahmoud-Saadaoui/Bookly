const express = require('express');
const router = express.Router();
const {
  handleSocialCallback,
  redirectToGoogle,
  redirectToFacebook
} = require('../controllers/authSocialController');

// Google OAuth2
router.get('/google', redirectToGoogle);
router.get('/google/callback', handleSocialCallback('google'));

// Facebook OAuth2
router.get('/facebook', redirectToFacebook);
router.get('/facebook/callback', handleSocialCallback('facebook'));

module.exports = router;

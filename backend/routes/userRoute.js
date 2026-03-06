const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");
const router = express.Router();
const auth = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerValidation, loginValidation } = require('../validators/authValidator');

//  api/users/register
router.post('/register', authLimiter, registerValidation, registerUser)

//  api/users/login
router.post('/login', authLimiter, loginValidation, loginUser)

//  api/users/me
router.get('/me', auth.check, getMe)


module.exports = router;

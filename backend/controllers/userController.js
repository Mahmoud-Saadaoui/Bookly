const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwtHelpers = require('../utils/jwtHelpers');
const { asyncHandler } = require('../middlewares/asyncHandler');
const {
  createdResponse,
  successResponse,
  badRequestResponse,
  conflictResponse,
  internalErrorResponse,
  unauthorizedResponse
} = require('../utils/apiResponse');

// method   POST
// route    api/users/register
// desc     Register new user
// access   Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        // Check if user exists
        if (user) {
            return conflictResponse(res, 'User already exists');
        }

        user = new User({
            name,
            email,
            password
        });

        // Encrypt Password with increased cost factor
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        user.password = await bcrypt.hash(password, saltRounds);
        await user.save();

        return createdResponse(res, {
            name: user.name,
            isAdmin: user.isAdmin,
            accessToken: jwtHelpers.sign({ sub: user.id })
        }, 'User registered successfully');
    } catch (err) {
        console.error('Error registering user:', err.message);
        return internalErrorResponse(res, 'Failed to register user');
    }
});

// method   POST
// route    api/users/login
// desc     Login user
// access   Public
const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user && bcrypt.compareSync(password, user.password)) {
            return successResponse(res, {
                name: user.name,
                isAdmin: user.isAdmin,
                accessToken: jwtHelpers.sign({ sub: user.id })
            }, 'Login successful');
        } else {
            return unauthorizedResponse(res, 'Invalid email or password');
        }
    } catch (err) {
        console.error('Error logging in user:', err.message);
        return internalErrorResponse(res, 'Failed to login');
    }
});

// method   GET
// route    api/users/me
// desc     User Authentication
// access   Private
const getMe = asyncHandler(async(req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        return successResponse(res, {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }, 'User retrieved successfully');
    } catch (err) {
        console.error('Error getting user:', err.message);
        return internalErrorResponse(res, 'Failed to retrieve user');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getMe
};

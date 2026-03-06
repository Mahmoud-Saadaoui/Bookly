const { asyncHandler } = require('../middlewares/asyncHandler');
const Book = require('../models/book');
const User = require('../models/user');
const {
  successResponse,
  notFoundResponse,
  createdResponse
} = require('../utils/apiResponse');

// method   POST
// route    api/favoriteList
// desc     Add to favorite books
// access   Private | auth
const addToFavorites = asyncHandler(async(req, res) => {
    const { book, favorite } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
        return notFoundResponse(res, 'User');
    }

    const existingIndex = user.favoriteList.findIndex(e => e.book == book);
    if (existingIndex > -1) {
        user.favoriteList[existingIndex].favorite = favorite;
    } else {
        user.favoriteList.push({ book, favorite });
    }

    await user.save();

    return createdResponse(res, user.favoriteList, 'Book added to favorites');
});

// method   DELETE
// route    api/favoriteList/:id
// desc     Remove from favorites
// access   Private | auth
const deleteFromFavorites = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.userId);

    if (!user) {
        return notFoundResponse(res, 'User');
    }

    user.favoriteList = user.favoriteList.filter(el => el.book != id);
    await user.save();

    return successResponse(res, user.favoriteList, 'Book removed from favorites');
});

// method   GET
// route    api/favoriteList
// desc     Get favorite books
// access   Private | auth
const getFavorites = asyncHandler(async(req, res) => {
    const user = await User.findById(req.userId)
        .select('-favoriteList._id')
        .populate('favoriteList.book', ['_id', 'title', 'category', 'rate', 'image']);

    if (!user) {
        return notFoundResponse(res, 'User');
    }

    return successResponse(res, user.favoriteList, 'Favorites retrieved successfully');
});

module.exports = {
    addToFavorites,
    deleteFromFavorites,
    getFavorites
};

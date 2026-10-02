const { asyncHandler } = require('../middlewares/asyncHandler');
const Book = require('../models/book');
const User = require('../models/user');
const {
  successResponse,
  notFoundResponse,
  badRequestResponse,
} = require('../utils/apiResponse');

const MAX_FAVORITES_PER_USER = Number(process.env.MAX_FAVORITES_PER_USER) || 500;

// method   POST
// route    api/favoriteList
// desc     Add to favorite books
// access   Private | auth
const addToFavorites = asyncHandler(async(req, res) => {
    const { book, favorite } = req.body;
    const isFavorite = favorite === true || favorite === 'true';

    const [userExists, bookExists] = await Promise.all([
        User.exists({ _id: req.userId }),
        Book.exists({ _id: book, isDeleted: { $ne: true } })
    ]);

    if (!userExists) {
        return notFoundResponse(res, 'User');
    }

    if (!bookExists) {
        return notFoundResponse(res, 'Book');
    }

    let updatedUser;
    if (isFavorite) {
        // The array predicate is re-evaluated atomically by MongoDB, preventing duplicates.
        updatedUser = await User.findOneAndUpdate(
            {
                _id: req.userId,
                'favoriteList.book': { $ne: book },
                $expr: {
                    $lt: [
                        { $size: { $ifNull: ['$favoriteList', []] } },
                        MAX_FAVORITES_PER_USER
                    ]
                }
            },
            {
                $push: {
                    favoriteList: { book, favorite: true }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            updatedUser = await User.findById(req.userId).select('favoriteList');

            if (!updatedUser) {
                return notFoundResponse(res, 'User');
            }

            if (updatedUser.favoriteList.some((favorite) => favorite.book?.toString() === book)) {
                return successResponse(
                    res,
                    updatedUser.favoriteList,
                    'Book already in favorites'
                );
            }

            if (updatedUser.favoriteList.length >= MAX_FAVORITES_PER_USER) {
                return badRequestResponse(res, 'Favorite list limit reached');
            }
        }
    } else {
        updatedUser = await User.findOneAndUpdate(
            { _id: req.userId },
            { $pull: { favoriteList: { book } } },
            { new: true }
        );
    }

    if (!updatedUser) {
        return notFoundResponse(res, 'User');
    }

    return successResponse(
        res,
        updatedUser.favoriteList,
        isFavorite ? 'Book added to favorites' : 'Book removed from favorites'
    );
});

// method   DELETE
// route    api/favoriteList/:id
// desc     Remove from favorites
// access   Private | auth
const deleteFromFavorites = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { favoriteList: { book: id } } },
        { new: true }
    );

    if (!user) {
        return notFoundResponse(res, 'User');
    }

    return successResponse(res, user.favoriteList, 'Book removed from favorites');
});

// method   GET
// route    api/favoriteList
// desc     Get favorite books
// access   Private | auth
const getFavorites = asyncHandler(async(req, res) => {
    const user = await User.findById(req.userId)
        .select('-favoriteList._id')
        .populate({
            path: 'favoriteList.book',
            select: '_id title category rate image',
            match: { isDeleted: { $ne: true } }
        });

    if (!user) {
        return notFoundResponse(res, 'User');
    }

    return successResponse(
        res,
        user.favoriteList.filter((favorite) => favorite.book),
        'Favorites retrieved successfully'
    );
});

module.exports = {
    addToFavorites,
    deleteFromFavorites,
    getFavorites
};

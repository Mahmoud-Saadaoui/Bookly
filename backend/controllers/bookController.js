const mongoose = require('mongoose');
const Book = require('../models/book');
const User = require('../models/user');
const Loan = require('../models/loan');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
const { asyncHandler } = require('../middlewares/asyncHandler');
const HttpError = require('../utils/httpError');
const logger = require('../utils/logger');
const {
  createdResponse,
  successResponse,
  notFoundResponse,
  badRequestResponse,
  forbiddenResponse,
  conflictResponse,
  paginatedResponse
} = require('../utils/apiResponse');

const MAX_REVIEWS_PER_BOOK = Number(process.env.MAX_REVIEWS_PER_BOOK) || 500;

// method   POST
// route    api/books
// desc     Create new book
// access   Private | admin
const createBook = asyncHandler(async(req, res) => {
    // Image Validation
    const image = req.file;
    if (!image) {
        return badRequestResponse(res, 'No image provided');
    }

    // Upload Photo to Cloudinary
    let uploadResponse;
    try {
        uploadResponse = await cloudinaryUploadImage(image.buffer);
    } catch (cloudinaryError) {
        logger.error('Cloudinary upload failed', { message: cloudinaryError.message });
        throw new HttpError('Image upload failed', 502, 'IMAGE_UPLOAD_FAILED');
    }

    // Prepare book data
    const bookData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        createdBy: req.userId,
        image: {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        },
        author: req.body.author,
        language: req.body.language,
    };

    // Only add PublicationDate if provided
    if (req.body.PublicationDate) {
        bookData.PublicationDate = new Date(req.body.PublicationDate);
    }

    // Save new book in database
    let book;
    try {
        book = await Book.create(bookData);
    } catch (error) {
        try {
            await cloudinaryRemoveImage(uploadResponse.public_id);
        } catch (cleanupError) {
            logger.error('Failed to clean up orphaned Cloudinary image', {
                message: cleanupError.message,
                publicId: uploadResponse.public_id
            });
        }
        throw error;
    }

    return createdResponse(res, book, 'Book created successfully');
});

// method   GET
// route    api/books
// desc     Get all books
// access   Public
const getBooks = asyncHandler(async(req, res) => {
    const page = Math.min(Math.max(parseInt(req.query?.page, 10) || 1, 1), 10000);
    const requestedLimit = parseInt(req.query?.limit, 10) || 10;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    const skip = (page - 1) * limit;
    const search = typeof req.query?.q === 'string'
        ? req.query.q.trim().slice(0, 200)
        : '';
    const category = typeof req.query?.category === 'string'
        ? req.query.category.trim().slice(0, 50)
        : '';
    const match = { isDeleted: false };

    if (search) {
        match.$text = { $search: search };
    }

    if (category) {
        match.category = category;
    }

    const sort = search
        ? { score: { $meta: 'textScore' }, createdAt: -1, _id: 1 }
        : { createdAt: -1, _id: 1 };

    const result = await Book.aggregate([
        { $match: match },
        {
            $facet: {
                data: [
                    { $sort: sort },
                    { $skip: skip },
                    { $limit: limit },
                    { $addFields: { id: '$_id' } },
                    {
                        $project: {
                            _id: 0,
                            id: 1,
                            title: 1,
                            description: 1,
                            category: 1,
                            image: 1,
                            author: 1,
                            language: 1,
                            PublicationDate: 1,
                            rate: 1,
                            createdAt: 1,
                            updatedAt: 1
                        }
                    }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ]);

    const books = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    const pages = Math.ceil(total / limit);

    return paginatedResponse(res, books, { page, limit, total, pages });
});

// method   GET
// route    api/books/categories
// desc     Get categories used by active books
// access   Public
const getCategories = asyncHandler(async(req, res) => {
    const categories = await Book.distinct('category', { isDeleted: { $ne: true } });
    const sortedCategories = categories
        .filter(Boolean)
        .sort((first, second) => first.localeCompare(second));

    return successResponse(res, sortedCategories, 'Book categories retrieved successfully');
});

// method   GET
// route    api/books/:id
// desc     Find a book
// access   Private | auth
const findBook = asyncHandler(async(req, res) => {
    const book = await Book.findOne({
        _id: req.params.id,
        isDeleted: { $ne: true }
    });

    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    return successResponse(res, book, 'Book retrieved successfully');
});

// method   DELETE
// route    api/books/:id
// desc     Delete a book
// access   Private | admin
const deleteBook = asyncHandler(async(req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const book = await Book.findOne({
                _id: req.params.id,
                isDeleted: { $ne: true }
            }).session(session).select('_id');

            if (!book) {
                throw new HttpError('Book not found', 404, 'BOOK_NOT_FOUND');
            }

            const activeLoan = await Loan.exists({
                book: book._id,
                status: 'active'
            }).session(session);

            if (activeLoan) {
                throw new HttpError(
                    'A book with an active loan cannot be deleted',
                    400,
                    'BOOK_HAS_ACTIVE_LOAN'
                );
            }

            // Keep the loan check and soft delete in the same transaction.
            const result = await Book.updateOne(
                { _id: book._id, isDeleted: { $ne: true } },
                { $set: { isDeleted: true } },
                { session }
            );

            if (result.modifiedCount !== 1) {
                throw new HttpError('Book not found', 404, 'BOOK_NOT_FOUND');
            }
        });
    } finally {
        await session.endSession();
    }

    return successResponse(res, { bookId: req.params.id }, 'Book deleted successfully');
});

// method   PUT
// route    api/books/:id
// desc     Update a book
// access   Private | admin
const updateBook = asyncHandler(async(req, res) => {
    const book = await Book.findOne({
        _id: req.params.id,
        isDeleted: { $ne: true }
    });

    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    const editableFields = [
        'title',
        'description',
        'category',
        'author',
        'language',
        'PublicationDate'
    ];
    const updates = Object.fromEntries(
        editableFields
            .filter((field) => req.body[field] !== undefined)
            .map((field) => [field, req.body[field]])
    );

    if (Object.keys(updates).length === 0) {
        return badRequestResponse(res, 'At least one book field is required');
    }

    const updatedBook = await Book.findOneAndUpdate(
        { _id: req.params.id, isDeleted: { $ne: true } },
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!updatedBook) {
        return notFoundResponse(res, 'Book');
    }

    return successResponse(res, updatedBook, 'Book updated successfully');
});

// method   PUT
// route    api/books/update-image/:id
// desc     Update book Image
// access   Private | admin
const updateBookImage = asyncHandler(async(req, res) => {
    const image = req.file;
    if (!image) {
        return badRequestResponse(res, 'No image provided');
    }

    const book = await Book.findOne({
        _id: req.params.id,
        isDeleted: { $ne: true }
    });
    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    // Upload new Image
    let uploadResponse;
    try {
        uploadResponse = await cloudinaryUploadImage(image.buffer);
    } catch (cloudinaryError) {
        logger.error('Cloudinary image replacement failed', { message: cloudinaryError.message });
        throw new HttpError('Image upload failed', 502, 'IMAGE_UPLOAD_FAILED');
    }

    // Update Image Field in DB
    let updatedBook;
    try {
        updatedBook = await Book.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            {
                $set: {
                    image: {
                        url: uploadResponse.secure_url,
                        publicId: uploadResponse.public_id
                    }
                }
            },
            { new: true }
        );
    } catch (error) {
        try {
            await cloudinaryRemoveImage(uploadResponse.public_id);
        } catch (cleanupError) {
            logger.error('Failed to clean up replacement Cloudinary image', {
                message: cleanupError.message,
                publicId: uploadResponse.public_id
            });
        }
        throw error;
    }

    if (!updatedBook) {
        await cloudinaryRemoveImage(uploadResponse.public_id);
        return notFoundResponse(res, 'Book');
    }

    if (book.image?.publicId && book.image.publicId !== uploadResponse.public_id) {
        try {
            await cloudinaryRemoveImage(book.image.publicId);
        } catch (cleanupError) {
            logger.warn('Failed to remove previous Cloudinary image', {
                message: cleanupError.message,
                publicId: book.image.publicId
            });
        }
    }

    return successResponse(res, updatedBook, 'Image updated successfully');
});

// method   POST
// route    api/books/:id/reviews
// desc     Add a book review
// access   Private | auth
const addReview = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { comment, rate } = req.body;
    const [user, hasBorrowedBook] = await Promise.all([
        User.findById(req.userId).select('name').lean(),
        Loan.exists({
            user: req.userId,
            book: id,
            status: { $in: ['active', 'returned', 'overdue'] }
        })
    ]);

    if (!user) {
        return notFoundResponse(res, 'User');
    }

    if (!hasBorrowedBook) {
        return forbiddenResponse(res, 'You can only review books you have borrowed');
    }

    const updatedBook = await Book.findOneAndUpdate(
        {
            _id: id,
            isDeleted: { $ne: true },
            'reviews.user': { $ne: req.userId },
            $expr: {
                $lt: [
                    { $size: { $ifNull: ['$reviews', []] } },
                    MAX_REVIEWS_PER_BOOK
                ]
            }
        },
        [
            {
                $set: {
                    reviews: {
                        $concatArrays: [
                            '$reviews',
                            [{
                                user: new mongoose.Types.ObjectId(req.userId),
                                username: user.name,
                                comment,
                                rate: Number(rate)
                            }]
                        ]
                    }
                }
            },
            {
                $set: {
                    rate: { $avg: '$reviews.rate' }
                }
            }
        ],
        { new: true }
    );

    if (!updatedBook) {
        const book = await Book.findOne({ _id: id, isDeleted: { $ne: true } })
            .select('reviews')
            .lean();

        if (!book) {
            return notFoundResponse(res, 'Book');
        }

        if (book.reviews?.some((review) => review.user?.toString() === req.userId)) {
            return badRequestResponse(res, 'You have already reviewed this book');
        }

        if ((book.reviews?.length || 0) >= MAX_REVIEWS_PER_BOOK) {
            return conflictResponse(res, 'This book has reached its review limit');
        }

        return badRequestResponse(res, 'Review could not be added');
    }

    return successResponse(res, { message: 'Review added successfully' }, 'Review added successfully');
});

// method   GET
// route    api/books/:id/reviews
// desc     Get a book review
// access   Public
const getReviews = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const page = Math.min(Math.max(parseInt(req.query?.page, 10) || 1, 1), 10000);
    const requestedLimit = parseInt(req.query?.limit, 10) || 20;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    const skip = (page - 1) * limit;

    const [result] = await Book.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: { $ne: true } } },
        {
            $project: {
                reviews: { $slice: [{ $ifNull: ['$reviews', []] }, skip, limit] },
                total: { $size: { $ifNull: ['$reviews', []] } }
            }
        }
    ]);

    if (!result) {
        return notFoundResponse(res, 'Book');
    }

    return paginatedResponse(
        res,
        result.reviews,
        {
            page,
            limit,
            total: result.total,
            pages: Math.ceil(result.total / limit)
        },
        'Reviews retrieved successfully'
    );
});

module.exports = {
    createBook,
  getBooks,
  getCategories,
  findBook,
    deleteBook,
    updateBook,
    updateBookImage,
    addReview,
    getReviews
};

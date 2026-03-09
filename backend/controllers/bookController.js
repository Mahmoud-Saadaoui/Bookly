const Book = require('../models/book');
const User = require('../models/user');
const { cloudinary, cloudinaryRemoveImage } = require("../utils/cloudinary");
const { asyncHandler } = require('../middlewares/asyncHandler');
const {
  createdResponse,
  successResponse,
  notFoundResponse,
  badRequestResponse,
  internalErrorResponse,
  paginatedResponse
} = require('../utils/apiResponse');

// method   POST
// route    api/books
// desc     Create new book
// access   Private | admin
const createBook = asyncHandler(async(req, res) => {
    // Log incoming request data for debugging
    console.log('Creating book with data:', {
        title: req.body?.title,
        author: req.body?.author,
        category: req.body?.category,
        hasImage: !!req.file,
        userId: req.userId
    });

    // Image Validation
    const image = req.file;
    if (!image) {
        console.error('No image file in request');
        return badRequestResponse(res, 'No image provided');
    }

    console.log('Image file details:', {
        mimetype: image.mimetype,
        size: image.size,
        bufferLength: image.buffer?.length
    });

    // Upload Photo to Cloudinary
    let uploadResponse;
    try {
        const base64 = image.buffer.toString("base64");
        const mimeType = image.mimetype;
        const dataUri = `data:${mimeType};base64,${base64}`;

        console.log('Uploading to Cloudinary...');
        uploadResponse = await cloudinary.uploader.upload(dataUri);
        console.log('Cloudinary upload successful:', uploadResponse.public_id);
    } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return badRequestResponse(res, `Failed to upload image: ${cloudinaryError.message}`);
    }

    // Prepare book data
    const bookData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.userId,
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

    console.log('Saving book to database...');

    // Save new book in database
    const book = await Book.create(bookData);

    console.log('Book created successfully:', book._id);

    return createdResponse(res, book, 'Book created successfully');
});

// method   GET
// route    api/books
// desc     Get all books
// access   Public
const getBooks = asyncHandler(async(req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    // Optimized query with aggregation for pagination
    const result = await Book.aggregate([
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    { $addFields: { id: '$_id' } },
                    { $project: { reviews: 0, _id: 0 } }
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
// route    api/books/:id
// desc     Find a book
// access   Private | auth
const findBook = asyncHandler(async(req, res) => {
    const book = await Book.findById(req.params.id);

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
    const book = await Book.findById(req.params.id);

    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    // Delete Book from DB
    await Book.findByIdAndDelete(req.params.id);

    // Delete Book from Cloudinary
    if (book.image?.publicId) {
        await cloudinaryRemoveImage(book.image.publicId);
    }

    return successResponse(res, { bookId: req.params.id }, 'Book deleted successfully');
});

// method   PUT
// route    api/books/:id
// desc     Update a book
// access   Private | admin
const updateBook = asyncHandler(async(req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    // Update Book
    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                author: req.body.author,
                language: req.body.language,
                PublicationDate: req.body.PublicationDate,
            }
        },
        { new: true, runValidators: true }
    );

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

    const book = await Book.findById(req.params.id);
    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    // Delete Old Image from Cloudinary
    if (book.image?.publicId) {
        await cloudinaryRemoveImage(book.image.publicId);
    }

    // Upload new Image
    const base64 = image.buffer.toString('base64');
    const mimeType = image.mimetype;
    const uploadResponse = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64}`,
    );

    // Update Image Field in DB
    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
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

    return successResponse(res, updatedBook, 'Image updated successfully');
});

// method   POST
// route    api/books/:id/reviews
// desc     Add a book review
// access   Private | auth
const addReview = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { comment, rate } = req.body;
    const book = await Book.findById(id);
    const user = await User.findById(req.userId);

    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    const isRated = book.reviews.findIndex(m => m.user.toString() === req.userId.toString());
    if (isRated > -1) {
        return badRequestResponse(res, 'You have already reviewed this book');
    }

    const totalRate = book.reviews.reduce((sum, review) => sum + review.rate, 0);
    const finalRate = (totalRate + rate) / (book.reviews.length + 1);

    await Book.updateOne(
        { _id: id },
        {
            $push: {
                reviews: {
                    user: req.userId,
                    username: user.name,
                    comment,
                    rate
                }
            },
            $set: {
                rate: finalRate
            }
        }
    );

    return successResponse(res, { message: 'Review added successfully' }, 'Review added successfully');
});

// method   GET
// route    api/books/:id/reviews
// desc     Get a book review
// access   Public
const getReviews = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
        return notFoundResponse(res, 'Book');
    }

    return successResponse(res, book.reviews, 'Reviews retrieved successfully');
});

module.exports = {
    createBook,
    getBooks,
    findBook,
    deleteBook,
    updateBook,
    updateBookImage,
    addReview,
    getReviews
};

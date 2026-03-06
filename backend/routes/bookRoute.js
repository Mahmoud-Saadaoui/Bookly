const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  findBook,
  deleteBook,
  updateBook,
  updateBookImage,
  addReview,
  getReviews,
} = require("../controllers/bookController");
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const { upload } = require('../middlewares/photoUpload');
const { bookCreationLimiter } = require('../middlewares/rateLimiter');
const {
  createBookValidation,
  updateBookValidation,
  bookIdValidation,
  addReviewValidation
} = require('../validators/bookValidator');

//  api/books
router.post('/', auth.check, admin.check, bookCreationLimiter, upload.single("image"), createBookValidation, createBook)

//  api/books
router.get('/', getBooks)

//  api/books/:id
router.get('/:id', auth.check, bookIdValidation, findBook)

//  api/books/:id
router.delete('/:id', auth.check, admin.check, bookIdValidation, deleteBook)

//  api/books/:id
router.put('/:id', auth.check, admin.check, updateBookValidation, updateBook)

//  api/books/update-image/:id
router.put(
  "/update-image/:id",
  auth.check,
  admin.check,
  upload.single("image"),
  bookIdValidation,
  updateBookImage
);

//  api/books/:id/reviews
router.post('/:id/reviews', auth.check, addReviewValidation, addReview)

//  api/books/:id/reviews - Made public (removed auth.check)
router.get('/:id/reviews', bookIdValidation, getReviews)

module.exports = router;

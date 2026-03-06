const express = require('express');
const router = express.Router();
const {
  addToFavorites,
  deleteFromFavorites,
  getFavorites,
} = require("../controllers/favoritesController");
const auth = require('../middlewares/auth');
const { addToFavoritesValidation, favoriteIdValidation } = require('../validators/favoriteValidator');

//  api/favoriteList
router.post('/', auth.check, addToFavoritesValidation, addToFavorites)

//  api/favoriteList/:id
router.delete('/:id', auth.check, favoriteIdValidation, deleteFromFavorites)

//  api/favoriteList
router.get('/', auth.check, getFavorites)

module.exports = router;

const express = require('express');
const router = express.Router();
const { getRecipes, searchRecipes } = require('../controllers/recipeController');

// GET /api/recipes - Get all recipes (paginated and sorted by rating)
router.get('/', getRecipes);

// GET /api/recipes/search - Search recipes with filters
router.get('/search', searchRecipes);

module.exports = router;

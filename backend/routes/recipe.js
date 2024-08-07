const express = require('express');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/recipes
// Get all recipes for the authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/recipes/:id
// Get a specific recipe for the authenticated user
router.get('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    // Check if the recipe belongs to the authenticated user
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/recipes
// Create a new recipe for the authenticated user
router.post('/', protect, async (req, res) => {
  try {
    const { name, ingredients, numberOfBalls, ballWeight, customIngredients } = req.body;
    const newRecipe = new Recipe({
      userId: req.user._id,
      name,
      ingredients,
      numberOfBalls,
      ballWeight,
      customIngredients
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/recipes/:id
// Update a recipe for the authenticated user
router.put('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    // Check if the recipe belongs to the authenticated user
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, ingredients, numberOfBalls, ballWeight, customIngredients } = req.body;
    recipe.name = name;
    recipe.ingredients = ingredients;
    recipe.numberOfBalls = numberOfBalls;
    recipe.ballWeight = ballWeight;
    recipe.customIngredients = customIngredients;

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/recipes/:id
// Delete a recipe for the authenticated user
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    // Check if the recipe belongs to the authenticated user
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

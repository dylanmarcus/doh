const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  ingredients: [
    {
      label: String,
      percentage: Number,
      selected: Boolean
    }
  ],
  numberOfBalls: { type: Number, required: true },
  ballWeight: { type: Number, required: true }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
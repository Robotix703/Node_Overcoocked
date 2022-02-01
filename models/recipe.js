const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  numberOfLunch: { type: Number, required: true },
  imagePath: { type: String, required: true},
  category: { type: String, required: true },
  duration: { type: Number, required: true },
  score: { type: Number }
});

module.exports = mongoose.model('Recipe', recipeSchema);

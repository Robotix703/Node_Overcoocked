const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  instructionsID: { type: [String], required: true },
  numberOfLunch: { type: Number, required: true },
  imagePath: { type: String, required: true}
});

module.exports = mongoose.model('Recipe', recipeSchema);

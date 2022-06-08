export interface IRecipe{
  _id: string
  title: string
  numberOfLunch: number
  imagePath: string
  category: string
  duration: number
  score: number | null
  lastCooked: Date | null
}

const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  numberOfLunch: { type: Number, required: true },
  imagePath: { type: String, required: true},
  category: { type: String, required: true },
  duration: { type: Number, required: true },
  score: { type: Number },
  lastCooked: { type: Date }
});

module.exports = mongoose.model('Recipe', recipeSchema);

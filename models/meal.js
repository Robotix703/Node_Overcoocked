const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
  recipeID: { type: String, required: true },
  numberOfLunchPlanned: { type: Number, required: true }
});

module.exports = mongoose.model('Meal', mealSchema);

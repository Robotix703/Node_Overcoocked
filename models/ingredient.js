const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required:true },
  consumable: { type: Boolean }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);

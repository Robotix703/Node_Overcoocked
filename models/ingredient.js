const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required:true },
  consumable: { type: Boolean, required: true },
  category: { type: String, required: true },
  unitOfMeasure: { type: String, required: true },
  shelfLife: { type: Number }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);

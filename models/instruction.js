const mongoose = require('mongoose');

const instructionSchema = mongoose.Schema({
  text: { type: String, required: true },
  recipeID: { type: String, required: true },
  ingredientsID: { type: [String] },
  quantity: { type: [Number] },
  order: { type: Number, required: true },
  cookingTime: { type: Number }
});

module.exports = mongoose.model('Instruction', instructionSchema);

const mongoose = require('mongoose');

const pantrySchema = mongoose.Schema({
  ingredientID: { type: String, required: true },
  quantity: { type: Number, required: true },
  expirationDate: { type: Date }
});

module.exports = mongoose.model('Pantry', pantrySchema);
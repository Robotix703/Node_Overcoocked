const mongoose = require('mongoose');

const instructionSchema = mongoose.Schema({
  text: { type: String, required: true },
  ingredients: { type: [String] }
});

module.exports = mongoose.model('Instruction', instructionSchema);

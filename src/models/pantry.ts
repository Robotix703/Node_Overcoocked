export interface pantry {
    _id: string
    ingredientID: string
    quantity: number
    expirationDate: Date | null
    frozen: boolean | null
}

const mongoose = require('mongoose');

const pantrySchema = mongoose.Schema({
  ingredientID: { type: String, required: true },
  quantity: { type: Number, required: true },
  expirationDate: { type: Date },
  frozen: { type: Boolean }
});

module.exports = mongoose.model('Pantry', pantrySchema);
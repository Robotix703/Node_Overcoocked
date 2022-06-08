export interface IIngredient {
  _id: string
  name: string
  imagePath: string
  consumable: boolean
  category: string
  unitOfMeasure: string
  shelfLife: number | null
  freezable: boolean
}

const mongoose = require('mongoose');

export const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required:true },
  consumable: { type: Boolean, required: true },
  category: { type: String, required: true },
  unitOfMeasure: { type: String, required: true },
  shelfLife: { type: Number },
  freezable: { type: Boolean, required: true }
});

const Ingredient = mongoose.model('Pantry', ingredientSchema);
export default Ingredient;
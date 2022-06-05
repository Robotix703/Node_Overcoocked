export interface todoItem {
  _id: string
  todoID: number
  text: string
  ingredientName: string
  consumable: boolean
}

const mongoose = require('mongoose');

const todoItemSchema = mongoose.Schema({
  todoID: { type: Number, required: true },
  text: { type: String, required: true },
  ingredientName: { type: String, required: true },
  consumable: { type: Boolean, required: true }
});

module.exports = mongoose.model('TodoItem', todoItemSchema);
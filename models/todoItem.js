const mongoose = require('mongoose');

const todoItemSchema = mongoose.Schema({
  todoID: { type: Number, required: true },
  text: { type: String, required: true },
  ingredientName: { type: String, required: true }
});

module.exports = mongoose.model('TodoItem', todoItemSchema);

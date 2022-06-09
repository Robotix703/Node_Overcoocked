export interface ITodoItem {
  _id: string
  todoID: number
  text: string
  ingredientName: string
  consumable: boolean
}

const mongoose = require('mongoose');

export const todoItemSchema = mongoose.Schema({
  todoID: { type: Number, required: true },
  text: { type: String, required: true },
  ingredientName: { type: String, required: true },
  consumable: { type: Boolean, required: true }
});

const TodoItem = mongoose.model('TodoItem', todoItemSchema);
export default TodoItem;
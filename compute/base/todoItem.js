const TodoItem = require("../../models/todoItem");

exports.getTodoItemByIngredientName = async function(ingredientName){
    return TodoItem.find({ingredientName: ingredientName});
}

exports.updateTodoItem = async function(todoItem){
    return TodoItem.updateOne({_id: todoItem._id}, todoItem);
}
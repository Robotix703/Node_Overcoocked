const TodoItem = require("../../models/todoItem");

exports.getTodoItemByIngredientName = async function(ingredientName){
    return TodoItem.find({ingredientName: ingredientName});
}

exports.updateTodoItem = async function(todoItem){
    return TodoItem.updateOne({_id: todoItem._id}, todoItem);
}

exports.readTodoItems = async function(){
    return TodoItem.find();
}

exports.deleteTodoItem = async function(todoItemID){
    return TodoItem.deleteOne({ _id: todoItemID });
}

exports.getTodoItemByID = async function(todoItemID){
    return TodoItem.findById(todoItemID);
}
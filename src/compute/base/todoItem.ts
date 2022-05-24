const TodoItemForBase = require("../../models/todoItem");

exports.getTodoItemByIngredientName = async function(ingredientName : string){
    return TodoItem.find({ingredientName: ingredientName});
}

exports.updateTodoItem = async function(todoItem : any){
    return TodoItem.updateOne({_id: todoItem._id}, todoItem);
}

exports.readTodoItems = async function(){
    return TodoItem.find();
}

exports.deleteTodoItem = async function(todoItemID : string){
    return TodoItem.deleteOne({ _id: todoItemID });
}

exports.getTodoItemByID = async function(todoItemID : string){
    return TodoItem.findById(todoItemID);
}
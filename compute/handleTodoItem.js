const TodoItem = require("../models/todoItem");
const baseTodoItem = require("./base/todoItem");

exports.checkIfIngredientIsAlreadyInTodo = async function(ingredientName){
    return await baseTodoItem.getTodoItemByIngredientName(ingredientName);
}

exports.updateTodoItem = async function(todoItemID, todoID, text, ingredientName){
    let todoItem = new TodoItem({
        _id: todoItemID,
        todoID: todoID,
        text: text,
        ingredientName: ingredientName
    });
    return await baseTodoItem.updateTodoItem(todoItem);
}
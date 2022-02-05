const TodoItem = require("../models/todoItem");
const baseTodoItem = require("./base/todoItem");

exports.checkIfIngredientIsAlreadyInTodo = async function (ingredientName) {
    return await baseTodoItem.getTodoItemByIngredientName(ingredientName);
}

exports.updateTodoItem = async function (todoItemID, todoID, text, ingredientName) {
    let todoItem = new TodoItem({
        _id: todoItemID,
        todoID: todoID,
        text: text,
        ingredientName: ingredientName
    });
    return await baseTodoItem.updateTodoItem(todoItem);
}

exports.registerTodoItem = async function (itemID, itemText, name) {
    const todoItem = new TodoItem({
        todoID: itemID,
        text: itemText,
        ingredientName: name
    });

    return await todoItem.save()
        .then(result => {
            return true;
        })
        .catch(error => {
            console.error(error);
            return false;
        });
}
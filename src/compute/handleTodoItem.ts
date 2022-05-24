const TodoItem = require("../models/todoItem");
const baseTodoItem = require("./base/todoItem");

exports.checkIfIngredientIsAlreadyInTodo = async function (ingredientName : string) {
    return await baseTodoItem.getTodoItemByIngredientName(ingredientName);
}

exports.updateTodoItem = async function (todoItemID : string, todoID : string, text : string, ingredientName : string) {
    let todoItem = new TodoItem({
        _id: todoItemID,
        todoID: todoID,
        text: text,
        ingredientName: ingredientName
    });
    return await baseTodoItem.updateTodoItem(todoItem);
}

exports.registerTodoItem = async function (itemID : string, itemText : string, name : string, consumable : boolean) {
    const todoItem = new TodoItem({
        todoID: itemID,
        text: itemText,
        ingredientName: name,
        consumable: consumable
    });

    return await todoItem.save()
        .then((result : any) => {
            return true;
        })
        .catch((error : Error) => {
            console.error(error);
            return false;
        });
}
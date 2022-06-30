const baseTodoItem = require("../../build/compute/base/todoItem").baseTodoItem;

const handleTodoItem = require("../../build/compute/handleTodoItem").handleTodoItem;

let todoItem = {
    _id: "string",
    todoID: 10,
    text: "text",
    ingredientName: "ingredientName",
    consumable: true
}

test('getIngredientIDFromInstruction', async () => {
    let getTodoItemByIngredientNameSpy = jest.spyOn(baseTodoItem, "getTodoItemByIngredientName").mockImplementationOnce(() => {
        return [todoItem];
    });
    
    let result = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(todoItem.ingredientName);

    expect(getTodoItemByIngredientNameSpy).toHaveBeenCalledWith(todoItem.ingredientName);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject([todoItem]);
});
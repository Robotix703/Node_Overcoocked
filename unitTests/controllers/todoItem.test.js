const baseTodoItem = require("../../build/compute/base/todoItem").baseTodoItem;

const Todoist = require("../../build/modules/todoist").Todoist;
const registerIngredient = require("../../build/worker/registerIngredientsOnTodo").registerIngredientsOnTodo;
const todoItemController = require("../../build/controllers/todoItem").todoItemController;

let todoItem = {
    _id: "string",
    todoID: 10,
    text: "text",
    ingredientName: "ingredientName",
    consumable: true
}

let update = {
    n: 1,
    modifiedCount: 1,
    ok: 1
}
let notUpdate = {
    n: 1,
    modifiedCount: 0,
    ok: 1
}

let deleteOne = {
    n: 1,
    deletedCount: 1,
    ok: 1
}
let notDeleteOne = {
    n: 1,
    deletedCount: 0,
    ok: 1
}

test('readTodoItems', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {

    }

    let spy = jest.spyOn(baseTodoItem, "readTodoItems").mockResolvedValue(
        [todoItem]
    );
    let spy2 = jest.spyOn(baseTodoItem, "count").mockResolvedValue(
        2
    );
    
    await todoItemController.readTodoItems(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        todoItems: [todoItem],
        count: 2
    });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});

test('writeTodoItem', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            ingredientID: "ingredientID",
            name: "name",
            quantity: "quantity",
            unitOfMeasure: "unitOfMeasure"
        }
    }

    let spy = jest.spyOn(registerIngredient, "registerIngredient").mockResolvedValue(
        "OK"
    );
    
    await todoItemController.writeTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({message: "Registered !"});
    expect(reponseStatus).toBe(201);

    spy.mockRestore();
});

test('updateTodoItem', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            todoID: "todoID",
            text: "text",
            ingredientName: "ingredientName",
            consumable: "consumable"
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        update
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        true
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({status: "Ok"});
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});
test('updateTodoItem without updateResult', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            todoID: "todoID",
            text: "text",
            ingredientName: "ingredientName",
            consumable: "consumable"
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        true
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "Update failed"
    });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});
test('updateTodoItem without update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            todoID: "todoID",
            text: "text",
            ingredientName: "ingredientName",
            consumable: "consumable"
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        notUpdate
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        true
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ message: "Pas de modification" });
    expect(reponseStatus).toBe(401);

    spy.mockRestore();
    spy2.mockRestore();
});
test('updateTodoItem with error on todoist', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            todoID: "todoID",
            text: "text",
            ingredientName: "ingredientName",
            consumable: "consumable"
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        update
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        false
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ message: "Problem with todoist" });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});

test('deleteTodoItem', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        }
    }

    let spy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockResolvedValue(
        todoItem
    );
    let spy2 = jest.spyOn(baseTodoItem, "deleteTodoItem").mockResolvedValue(
        deleteOne
    );
    let spy3 = jest.spyOn(Todoist, "deleteItem").mockResolvedValue(
        true
    );
    
    await todoItemController.deleteTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ status: "Ok" });
    expect(reponseStatus).toBe(200);
    expect(spy).toHaveBeenCalledWith(todoItem._id);
    expect(spy2).toHaveBeenCalledWith(todoItem._id);
    expect(spy3).toHaveBeenCalledWith(todoItem.todoID);

    spy.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
});
test('deleteTodoItem without getTodoItemByID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        }
    }

    let spy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockResolvedValue(
        
    );
    
    await todoItemController.deleteTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "TodoItem not found" });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
});
test('deleteTodoItem without deleteResult', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        }
    }

    let spy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockResolvedValue(
        todoItem
    );
    let spy2 = jest.spyOn(baseTodoItem, "deleteTodoItem").mockResolvedValue(
        
    );
    
    await todoItemController.deleteTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "Error on delete" });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});
test('deleteTodoItem without deleteCount', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        }
    }

    let spy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockResolvedValue(
        todoItem
    );
    let spy2 = jest.spyOn(baseTodoItem, "deleteTodoItem").mockResolvedValue(
        notDeleteOne
    );
    
    await todoItemController.deleteTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "Not item deleted" });
    expect(reponseStatus).toBe(401);

    spy.mockRestore();
    spy2.mockRestore();
});
test('deleteTodoItem with error on todoist', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        }
    }

    let spy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockResolvedValue(
        todoItem
    );
    let spy2 = jest.spyOn(baseTodoItem, "deleteTodoItem").mockResolvedValue(
        deleteOne
    );
    let spy3 = jest.spyOn(Todoist, "deleteItem").mockResolvedValue(
        false
    );
    
    await todoItemController.deleteTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "Error with todoist" });
    expect(reponseStatus).toBe(401);

    spy.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
});
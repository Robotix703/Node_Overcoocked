import { ITodoItem } from "../models/todoItem";

import { baseTodoItem } from "./base/todoItem";

export namespace handleTodoItem {

    export async function checkIfIngredientIsAlreadyInTodo(ingredientName : string) : Promise<ITodoItem[]> {
        return await baseTodoItem.getTodoItemByIngredientName(ingredientName);
    }
}
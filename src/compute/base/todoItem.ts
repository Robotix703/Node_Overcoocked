import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import { ITodoItem } from "../../models/todoItem";

export namespace baseTodoItem {

    export async function getTodoItemByIngredientName(ingredientName : string) : Promise<ITodoItem[]> {
        return TodoItem.find({ingredientName: ingredientName});
    }

    export async function updateTodoItem(todoItem : ITodoItem) : Promise<IUpdateOne>{
        return TodoItem.updateOne({_id: todoItem._id}, todoItem);
    }

    export async function readTodoItems() : Promise<ITodoItem[]> {
        return TodoItem.find();
    }

    export async function deleteTodoItem(todoItemID : string) : Promise<IDeleteOne> {
        return TodoItem.deleteOne({ _id: todoItemID });
    }

    export async function getTodoItemByID(todoItemID : string) : Promise<ITodoItem> {
        return TodoItem.findById(todoItemID);
    }
}
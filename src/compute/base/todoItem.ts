import { IDeleteOne, ISave, IUpdateOne } from "../../models/mongoose";
import TodoItem, { ITodoItem } from "../../models/todoItem";

export namespace baseTodoItem {

    export async function getTodoItemByIngredientName(ingredientName : string) : Promise<ITodoItem[]> {
        return TodoItem.find({ingredientName: ingredientName});
    }

    export async function updateTodoItem(todoItemID : string, todoID : string, text : string, ingredientName : string, consumable: boolean) : Promise<IUpdateOne>{
        let todoItem = new TodoItem({
            _id: todoItemID,
            todoID: todoID,
            text: text,
            ingredientName: ingredientName,
            consumable: consumable
        });
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

    export async function registerTodoItem(itemID : string, itemText : string, name : string, consumable : boolean) : Promise<any> {
        const todoItem = new TodoItem({
            todoID: itemID,
            text: itemText,
            ingredientName: name,
            consumable: consumable
        });
    
        return todoItem.save();
    }
}
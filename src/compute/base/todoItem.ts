import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import { ITodoItem } from "../../models/todoItem";

exports.getTodoItemByIngredientName = async function(ingredientName : string) : Promise<ITodoItem[]> {
    return TodoItem.find({ingredientName: ingredientName});
}

exports.updateTodoItem = async function(todoItem : ITodoItem) : Promise<IUpdateOne>{
    return TodoItem.updateOne({_id: todoItem._id}, todoItem);
}

exports.readTodoItems = async function() : Promise<ITodoItem[]> {
    return TodoItem.find();
}

exports.deleteTodoItem = async function(todoItemID : string) : Promise<IDeleteOne> {
    return TodoItem.deleteOne({ _id: todoItemID });
}

exports.getTodoItemByID = async function(todoItemID : string) : Promise<ITodoItem> {
    return TodoItem.findById(todoItemID);
}
import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import { todoItem } from "../../models/todoItem";

exports.getTodoItemByIngredientName = async function(ingredientName : string) : Promise<todoItem[]> {
    return TodoItem.find({ingredientName: ingredientName});
}

exports.updateTodoItem = async function(todoItem : todoItem) : Promise<IUpdateOne>{
    return TodoItem.updateOne({_id: todoItem._id}, todoItem);
}

exports.readTodoItems = async function() : Promise<todoItem[]> {
    return TodoItem.find();
}

exports.deleteTodoItem = async function(todoItemID : string) : Promise<IDeleteOne> {
    return TodoItem.deleteOne({ _id: todoItemID });
}

exports.getTodoItemByID = async function(todoItemID : string) : Promise<todoItem> {
    return TodoItem.findById(todoItemID);
}
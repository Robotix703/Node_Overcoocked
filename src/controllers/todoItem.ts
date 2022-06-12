import { Request, Response } from "express";
import TodoItem from "../models/todoItem";
import { baseTodoItem } from "../compute/base/todoItem";
import { Todoist } from "../modules/todoist";

const registerIngredient = require("../worker/registerIngredientsOnTodo");

exports.readTodoItems = async (req : Request, res : Response) => {
    let fetchedTodoItems : any= [];
    baseTodoItem.readTodoItems()
    .then((documents : any) => {
        fetchedTodoItems = documents;
        return TodoItem.count();
      })
      .then((count : number) => {
        res.status(200).json({ todoItems: fetchedTodoItems, count: count });
      })
      .catch((error : Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
}

exports.writeTodoItem = async (req : Request, res : Response) => {
    registerIngredient.registerIngredient(
        req.body.ingredientID,
        req.body.name,
        req.body.quantity,
        req.body.unitOfMeasure)
        .then((result : any) => {
            res.status(201).json(result);
        })
        .catch((error : Error) => {
            res.status(500).json({
                errorMessage: error
            })
        });
}

exports.updateTodoItem = async (req : Request, res : Response) => {
    baseTodoItem.updateTodoItem(req.params.id, req.body.todoID, req.body.text, req.body.ingredientName, req.body.consumable)
        .then(async (result : any) => {
            if (result.modifiedCount > 0) {
                await Todoist.updateItem(req.body.todoID, req.body.text);
                res.status(200).json({status: "Ok"});
            } else {
                res.status(401).json({ message: "Pas de modification" });
            }
        })
        .catch((error : Error) => {
            res.status(500).json({
                errorMessage: error
            })
        });
}

exports.deleteTodoItem = async (req : Request, res : Response) => {
    let todoItem = await baseTodoItem.getTodoItemByID(req.params.id);

    baseTodoItem.deleteTodoItem(req.params.id)
        .then(async (result : any) => {
            if (result.deletedCount > 0) {
                await Todoist.deleteItem(todoItem.todoID);
                res.status(200).json({ status: "Ok" });
            } else {
                res.status(401).json(result);
            }
        })
        .catch((error : Error) => {
            res.status(500).json({
                errorMessage: error
            })
        });
}
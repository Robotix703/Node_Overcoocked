import { Request, Response } from "express";
import { ITodoItem } from "../models/todoItem";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";

import { baseTodoItem } from "../compute/base/todoItem";
import { Todoist } from "../modules/todoist";

const registerIngredient = require("../worker/registerIngredientsOnTodo");

export namespace todoItemController {
    export async function readTodoItems(req : Request, res : Response) {
        let fetchedTodoItems : any = [];
    
        baseTodoItem.readTodoItems()
        .then((documents : ITodoItem[]) => {
            fetchedTodoItems = documents;
            return baseTodoItem.count();
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
    
    export async function writeTodoItem(req : Request, res : Response) {
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
    
    export async function updateTodoItem(req : Request, res : Response) {
        baseTodoItem.updateTodoItem(req.params.id, req.body.todoID, req.body.text, req.body.ingredientName, req.body.consumable)
        .then(async (result : IUpdateOne) => {
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
    
    export async function deleteTodoItem(req : Request, res : Response) {
        let todoItem : ITodoItem = await baseTodoItem.getTodoItemByID(req.params.id);
    
        baseTodoItem.deleteTodoItem(req.params.id)
        .then(async (result : IDeleteOne) => {
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
}
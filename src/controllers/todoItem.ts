import { Request, Response } from "express";
import { ITodoItem } from "../models/todoItem";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";

import { baseTodoItem } from "../compute/base/todoItem";
import { Todoist } from "../modules/todoist";

import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";

export namespace todoItemController {
    export async function readTodoItems(req : Request, res : Response) {
        let fetchedTodoItems : ITodoItem[] | void = await baseTodoItem.readTodoItems()
        .catch((error : Error) => {
            res.status(500).json({
              errorMessage: error
            });
            return;
        });

        let count : number | void = await baseTodoItem.count()
        .catch((error : Error) => {
            res.status(500).json({
              errorMessage: error
            });
            return;
        });

        let data = {
            todoItems: fetchedTodoItems,
            count: count
        }
        res.status(200).json(data);
    }
    
    export async function writeTodoItem(req : Request, res : Response) {
        registerIngredientsOnTodo.registerIngredient(
            req.body.ingredientID,
            req.body.name,
            req.body.quantity,
            req.body.unitOfMeasure)
        .then(() => {
            res.status(201).json({message: "Registered !"});
        })
        .catch((error : Error) => {
            res.status(500).json({
                errorMessage: error
            })
        });
    }
    
    export async function updateTodoItem(req : Request, res : Response) {
        let updateResult : IUpdateOne | void = await baseTodoItem.updateTodoItem(
            req.params.id, 
            req.body.todoID, 
            req.body.text, 
            req.body.ingredientName, 
            req.body.consumable
        )
        .catch((error : Error) => {
            res.status(500).json({
                errorMessage: error
            });
            return;
        });

        if(updateResult)
        {
            if (updateResult.modifiedCount > 0) {
                let result : boolean | void = await Todoist.updateItem(req.body.todoID, req.body.text)
                .catch((error : Error) => {
                    res.status(500).json({
                        errorMessage: error
                    });
                    return;
                });

                if(result)
                {
                    res.status(200).json({status: "Ok"});
                }
                else
                {
                    res.status(500).json({ message: "Problem with todoist" });
                }
            } else {
                res.status(401).json({ message: "Pas de modification" });
            }
        }
        else
        {
            res.status(500).json({
                errorMessage: "Update failed"
            });
        }
    }
    
    export async function deleteTodoItem(req : Request, res : Response) {
        let todoItem : ITodoItem | void = await baseTodoItem.getTodoItemByID(req.params.id)
        .catch((error : Error) => {
            res.status(500).json({
                errorMessage: error
            });
            return;
        });

        if(todoItem)
        {
            let deleteResult : IDeleteOne | void = await baseTodoItem.deleteTodoItem(req.params.id)
            .catch((error : Error) => {
                res.status(500).json({
                    errorMessage: error
                });
                return;
            });

            if(deleteResult)
            {
                if (deleteResult.deletedCount > 0) {

                    let result : boolean | void = await Todoist.deleteItem(todoItem.todoID)
                    .catch((error : Error) => {
                        res.status(500).json({
                            errorMessage: error
                        });
                        return;
                    });

                    if(result)
                    {
                        res.status(200).json({ status: "Ok" });
                    }
                    else res.status(401).json({ errorMessage: "Error with todoist" });

                } else res.status(401).json({ errorMessage: "Not item deleted" });
            }
            else res.status(500).json({ errorMessage: "Error on delete" });
        }
        else res.status(500).json({ errorMessage: "TodoItem not found" });
    }
}
import { Request, Response } from "express";

const baseTodoItemForTodoItem = require("../compute/base/todoItem");
const registerIngredient = require("../worker/registerIngredientsOnTodo");
const TodoistForTodoItem = require("../modules/Todoist/main");
const TodoItemForTodoItem = require("../models/todoItem");

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
    let todoItem = new TodoItem({
        _id: req.params.id,
        todoID: req.body.todoID,
        text: req.body.text,
        ingredientName: req.body.ingredientName,
        consumable: req.body.consumable
    });

    baseTodoItem.updateTodoItem(todoItem)
        .then(async (result : any) => {
            if (result.modifiedCount > 0) {
                await Todoist.updateItemInProjectByName(process.env.TODOPROJECT, req.body.todoID, req.body.text);
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
                await Todoist.deleteItemInProjectByName(process.env.TODOPROJECT, todoItem.todoID);
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
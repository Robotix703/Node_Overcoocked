const baseTodoItem = require("../compute/base/todoItem");
const registerIngredient = require("../worker/registerIngredientsOnTodo");
const Todoist = require("../modules/Todoist/main");
const TodoItem = require("../models/todoItem");

exports.readTodoItems = async (req, res) => {
    let todoItem = await baseTodoItem.readTodoItems();

    res.status(200).json(todoItem);
}

exports.writeTodoItem = async (req, res) => {
    registerIngredient.registerIngredient(
        req.body.ingredientID,
        req.body.name,
        req.body.quantity,
        req.body.unitOfMeasure)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(error => {
            res.status(500).json({
                errorMessage: error
            })
        });
}

exports.updateTodoItem = async (req, res) => {
    let todoItem = new TodoItem({
        _id: req.params.id,
        todoID: req.body.todoID,
        text: req.body.text,
        ingredientName: req.body.ingredientName
    });

    baseTodoItem.updateTodoItem(todoItem)
        .then(async (result) => {
            if (result.modifiedCount > 0) {
                await Todoist.updateItemInProjectByName(process.env.TODOPROJECT, req.body.todoID, text);
                res.status(200).json({status: "Ok"});
            } else {
                res.status(401).json({ message: "Pas de modification" });
            }
        })
        .catch(error => {
            res.status(500).json({
                errorMessage: error
            })
        });
}

exports.deleteTodoItem = async (req, res) => {
    let todoItem = await baseTodoItem.getTodoItemByID(req.params.id);

    baseTodoItem.deleteTodoItem(req.params.id)
        .then(async (result) => {
            if (result.deletedCount > 0) {
                await Todoist.deleteItemInProjectByName(process.env.TODOPROJECT, todoItem.todoID);
                res.status(200).json({ status: "Ok" });
            } else {
                res.status(401).json(result);
            }
        })
        .catch(error => {
            res.status(500).json({
                errorMessage: error
            })
        });
}
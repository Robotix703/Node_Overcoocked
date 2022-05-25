import express from "express";

const TodoItemControllers = require("../controllers/todoItem");
const checkAuth = require("../middleware/check-auth");

export const todoItemRoutes = express.Router();

//GET
todoItemRoutes.get("/", TodoItemControllers.readTodoItems);

//POST
todoItemRoutes.post("/", checkAuth, TodoItemControllers.writeTodoItem);

//PUT
todoItemRoutes.put("/:id", checkAuth, TodoItemControllers.updateTodoItem);

//DELETE
todoItemRoutes.delete("/:id", checkAuth, TodoItemControllers.deleteTodoItem);
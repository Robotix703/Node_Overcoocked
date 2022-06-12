import express from "express";

const checkAuth = require("../middleware/check-auth");

import { todoItemController } from "../controllers/todoItem";

export const todoItemRoutes = express.Router();

//GET
todoItemRoutes.get("/", todoItemController.readTodoItems);

//POST
todoItemRoutes.post("/", checkAuth, todoItemController.writeTodoItem);

//PUT
todoItemRoutes.put("/:id", checkAuth, todoItemController.updateTodoItem);

//DELETE
todoItemRoutes.delete("/:id", checkAuth, todoItemController.deleteTodoItem);
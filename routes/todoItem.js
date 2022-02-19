const express = require("express");
const TodoItemControllers = require("../controllers/todoItem");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//GET
router.get("/", TodoItemControllers.readTodoItems);

//POST
router.post("/", checkAuth, TodoItemControllers.writeTodoItem);

//PUT
router.put("/:id", checkAuth, TodoItemControllers.updateTodoItem);

//DELETE
router.delete("/:id", checkAuth, TodoItemControllers.deleteTodoItem);

module.exports = router;
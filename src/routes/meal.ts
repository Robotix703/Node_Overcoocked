import express from "express";

const checkAuth = require("../middleware/check-auth");

const MealControllers = require("../controllers/meal");

export const mealRoutes = express.Router();

//GET
mealRoutes.get("/", MealControllers.readMeals);
mealRoutes.get("/checkIfReady", MealControllers.checkIfReady);
mealRoutes.get("/displayable", MealControllers.displayable);

//POST
mealRoutes.post("/", checkAuth, MealControllers.writeMeal);
mealRoutes.post("/consume", checkAuth, MealControllers.consumeMeal);

//PUT
mealRoutes.put("/:id", checkAuth, MealControllers.updateMeal);

//DELETE
mealRoutes.delete("/:id", checkAuth, MealControllers.deleteMeal);
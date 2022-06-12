import express from "express";

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

import { recipeController } from "../controllers/recipe";

export const recipeRoutes = express.Router();

//GET
recipeRoutes.get("/", recipeController.readRecipes);
recipeRoutes.get("/byID", recipeController.getRecipeByID);
recipeRoutes.get("/filter", recipeController.getFilteredRecipe);
recipeRoutes.get("/byName", recipeController.getRecipeByName);
recipeRoutes.get("/prettyRecipe", recipeController.getPrettyRecipe);
recipeRoutes.get("/ingredientNeeded", recipeController.getIngredientsNeeded);

//POST
recipeRoutes.post("/", checkAuth, extractFile, recipeController.writeRecipe);

//PUT
recipeRoutes.put("/:id", checkAuth, recipeController.updateRecipe);

//DELETE
recipeRoutes.delete("/:id", checkAuth, recipeController.deleteRecipe);
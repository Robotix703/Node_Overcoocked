import express from "express";

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const RecipeControllers = require("../controllers/recipe");

export const recipeRoutes = express.Router();

//GET
recipeRoutes.get("/", RecipeControllers.readRecipes);
recipeRoutes.get("/byID", RecipeControllers.getRecipeByID);
recipeRoutes.get("/filter", RecipeControllers.getFilteredRecipe);
recipeRoutes.get("/byName", RecipeControllers.getRecipeByName);
recipeRoutes.get("/prettyRecipe", RecipeControllers.getPrettyRecipe);
recipeRoutes.get("/ingredientNeeded", RecipeControllers.getIngredientsNeeded);

//POST
recipeRoutes.post("/", checkAuth, extractFile, RecipeControllers.writeRecipe);

//PUT
recipeRoutes.put("/:id", checkAuth, RecipeControllers.updateRecipe);

//DELETE
recipeRoutes.delete("/:id", checkAuth, RecipeControllers.deleteRecipe);

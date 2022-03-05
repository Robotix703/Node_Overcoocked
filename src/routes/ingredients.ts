import express from "express";

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

import * as IngredientControllers from "../controllers/ingredient";

export const ingredientRoutes = express.Router();

//GET
ingredientRoutes.get("/", IngredientControllers.readIngredients);
ingredientRoutes.get("/consumableID", IngredientControllers.consumableID);
ingredientRoutes.get("/name", IngredientControllers.searchByName);
ingredientRoutes.get("/byID", IngredientControllers.getIngredientByID);
ingredientRoutes.get("/allNames", IngredientControllers.getAllIngredientsName);
ingredientRoutes.get("/filter", IngredientControllers.filteredIngredients);
ingredientRoutes.get("/forAutocomplete", IngredientControllers.getAllIngredientForAutocomplete);

//POST
ingredientRoutes.post("/", checkAuth, extractFile, IngredientControllers.writeIngredient);

//PUT
ingredientRoutes.put("/:id", checkAuth, IngredientControllers.editIngredient);

//DELETE
ingredientRoutes.delete("/:id", checkAuth, IngredientControllers.deleteIngredient);

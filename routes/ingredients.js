const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const IngredientControllers = require("../controllers/ingredient");

const router = express.Router();

//GET
router.get("/", IngredientControllers.readIngredients);
router.get("/consumableID", IngredientControllers.consumableID);
router.get("/name", IngredientControllers.searchByName);
router.get("/byID", IngredientControllers.getIngredientByID);
router.get("/allNames", IngredientControllers.getAllIngredientsName);
router.get("/filter", IngredientControllers.filteredIngredients);
router.get("/forAutocomplete", IngredientControllers.getAllIngredientForAutocomplete);

//POST
router.post("/", checkAuth, extractFile, IngredientControllers.writeIngredient);

//PUT
router.put("/:id", checkAuth, IngredientControllers.editIngredient);

//DELETE
router.delete("/:id", checkAuth, IngredientControllers.deleteIngredient);

module.exports = router;

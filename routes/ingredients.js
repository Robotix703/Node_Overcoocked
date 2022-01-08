const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const IngredientControllers = require("../controllers/ingredient");

const router = express.Router();

//GET
router.get("/", IngredientControllers.readIngredients);
router.get("/consumableID", IngredientControllers.consumableID);
router.get("/name", IngredientControllers.searchByName)

//POST
router.post("/", extractFile, IngredientControllers.writeIngredient);

//PUT
router.put("/:id", IngredientControllers.editIngredient);

//DELETE
router.delete("/:id", checkAuth, IngredientControllers.deleteIngredient);

module.exports = router;

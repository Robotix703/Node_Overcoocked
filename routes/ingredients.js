const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const IngredientControllers = require("../controllers/ingredient");

const router = express.Router();

//GET
router.get("/", IngredientControllers.readIngredients);

//POST
router.post("/", extractFile, IngredientControllers.writeIngredient);

//PUT
router.put("/:id", IngredientControllers.editIngredient);

//DELETE
router.delete("/:id", checkAuth, IngredientControllers.deleteIngredient);

module.exports = router;
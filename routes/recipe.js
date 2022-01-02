const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const RecipeControllers = require("../controllers/recipe");

const router = express.Router();

//GET
router.get("/", RecipeControllers.readRecipes);

//POST
router.post("/", extractFile, RecipeControllers.writeRecipe);

//PUT
router.put("/:id", checkAuth, RecipeControllers.updateRecipe);

//DELETE
router.delete("/:id", checkAuth, RecipeControllers.deleteRecipe);

module.exports = router;

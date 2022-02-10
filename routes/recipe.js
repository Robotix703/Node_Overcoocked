const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const RecipeControllers = require("../controllers/recipe");

const router = express.Router();

//GET
router.get("/", RecipeControllers.readRecipes);
router.get("/byID", RecipeControllers.getRecipeByID);
router.get("/filter", RecipeControllers.getFilteredRecipe);
router.get("/byName", RecipeControllers.getRecipeByName);
router.get("/prettyRecipe", RecipeControllers.getPrettyRecipe);

//POST
router.post("/", extractFile, RecipeControllers.writeRecipe);

//PUT
router.put("/:id", RecipeControllers.updateRecipe);

//DELETE
router.delete("/:id", checkAuth, RecipeControllers.deleteRecipe);

module.exports = router;

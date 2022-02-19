const express = require("express");

const checkAuth = require("../middleware/check-auth");

const MealControllers = require("../controllers/meal");

const router = express.Router();

//GET
router.get("/", MealControllers.readMeals);
router.get("/checkIfReady", MealControllers.checkIfReady);
router.get("/displayable", MealControllers.displayable);

//POST
router.post("/", checkAuth, MealControllers.writeMeal);
router.post("/consume", checkAuth, MealControllers.consumeMeal);

//PUT
router.put("/:id", checkAuth, MealControllers.updateMeal);

//DELETE
router.delete("/:id", checkAuth, MealControllers.deleteMeal);

module.exports = router;

const express = require("express");

const checkAuth = require("../middleware/check-auth");

const MealControllers = require("../controllers/meal");

const router = express.Router();

//GET
router.get("/", MealControllers.readMeals);

//POST
router.post("/", MealControllers.writeMeal);

//PUT
router.put("/:id", checkAuth, MealControllers.updateMeal);

//DELETE
router.delete("/:id", checkAuth, MealControllers.deleteMeal);

module.exports = router;

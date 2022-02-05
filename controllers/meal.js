const Meal = require('./../models/meal');

const baseMeal = require("../compute/base/meal");
const handleRecipe = require("../compute/handleRecipe");
const handleMeal = require("../compute/handleMeal");
const updatePantryWhenMealsIsDone = require("../compute/updatePantryWhenMealIsDone");
const checkIfMealIsReady = require("../compute/handleMeal");

const registerIngredientOnTodo = require("../worker/registerIngredientsOnTodo");

//POST
exports.writeMeal = async function (req, res) {
  const meal = new Meal({
    recipeID: req.body.recipeID,
    numberOfLunchPlanned: req.body.numberOfLunchPlanned
  });

  const ingredientsNeeded = await handleRecipe.getIngredientList(req.body.recipeID, req.body.numberOfLunchPlanned);
  registerIngredientOnTodo.registerIngredient(ingredientsNeeded);

  meal.save()
    .then(result => {
      res.status(201).json({ id: result._id, meal });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.consumeMeal = async function (req, res) {
  if (req.body.mealID) {
    await updatePantryWhenMealsIsDone.updatePantryWhenMealsIsDone(req.body.mealID);
    const result = await baseMeal.deleteMeal(req.body.mealID);

    if (result.deletedCount > 0) {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).send("Wrong ID");
    }
  }
}

//GET
exports.readMeals = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const mealQuery = Meal.find();
  let fetchedMeals = [];

  if (pageSize && currentPage) {
    mealQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  mealQuery
    .then(documents => {
      fetchedMeals = documents;
      return Meal.count();
    })
    .then(count => {
      res.status(200).json({ meals: fetchedMeals, count: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.checkIfReady = async (req, res) => {
  await checkIfMealIsReady.initPantryInventory();
  handleMeal.checkIfMealIsReady(req.query.mealID)
    .then((ready) => {
      res.status(200).json(ready);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.displayable = async (req, res) => {
  handleMeal.displayMealWithRecipeAndState()
    .then((mealsData) => {
      res.status(200).json(mealsData);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//PUT
exports.updateMeal = (req, res) => {
  const meal = new Meal({
    _id: req.params.id,
    recipeID: req.body.recipeID,
    numberOfLunchPlanned: req.body.numberOfLunchPlanned
  });

  Meal.updateOne({ _id: req.params.id }, meal)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json(meal);
      } else {
        res.status(401).json({ message: "Pas de modification" });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//DELETE
exports.deleteMeal = (req, res) => {
  Meal.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
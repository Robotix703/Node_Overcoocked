const Meal = require('./../models/meal');
const recipeIngredientsNeeded = require("../compute/recipeIngredientsNeeded");
const registerIngredientOnTodo = require("../worker/registerIngredientsOnTodo");
const checkIfMealIsReady = require("../compute/checkIfMealIsReady");

//POST
exports.writeMeal = async function(req, res){
  const meal = new Meal({
    recipeID: req.body.recipeID,
    numberOfLunchPlanned: req.body.numberOfLunchPlanned
  });

  let ingredientsNeeded = await recipeIngredientsNeeded.getIngredientList(req.body.recipeID, req.body.numberOfLunchPlanned);

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

//GET
exports.readMeals = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const mealQuery = Meal.find();
  let fetchedMeals;

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
  const mealID = req.query.mealID;

  checkIfMealIsReady.checkIfMealIsReady(mealID).then((ready) => {
    res.status(200).json(ready);
  })
  .catch(error => {
    res.status(500).json({
      errorMessage: error
    })
  });
}

//PUT
exports.updateMeal = (req, res) => {
  let meal = new Meal({
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
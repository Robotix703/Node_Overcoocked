import { Request, Response } from "express";
const Meal = require("../models/meal");

const baseMeal = require("../compute/base/meal");
const handleRecipe = require("../compute/handleRecipe");
const handleMeal = require("../compute/handleMeal");
const updatePantryWhenMealsIsDone = require("../compute/updatePantryWhenMealIsDone");
const checkIfMealIsReady = require("../compute/handleMeal");

const registerIngredientOnTodo = require("../worker/registerIngredientsOnTodo");

//POST
exports.writeMeal = async function (req : Request, res : Response) {
  const meal = new Meal({
    recipeID: req.body.recipeID,
    numberOfLunchPlanned: req.body.numberOfLunchPlanned
  });

  const ingredientsNeeded = await handleRecipe.getIngredientList(req.body.recipeID, req.body.numberOfLunchPlanned);
  registerIngredientOnTodo.registerIngredients(ingredientsNeeded);

  meal.save()
    .then((result : any) => {
      res.status(201).json({ id: result._id, meal });
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.consumeMeal = async function (req : Request, res : Response) {
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
exports.readMeals = (req : any, res : Response) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const mealQuery = Meal.find();
  let fetchedMeals : any[] = [];

  if (pageSize && currentPage) {
    mealQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  mealQuery
    .then((documents : any) => {
      fetchedMeals = documents;
      return Meal.count();
    })
    .then((count : number) => {
      res.status(200).json({ meals: fetchedMeals, count: count });
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.checkIfReady = async (req : any, res : Response) => {
  await checkIfMealIsReady.initPantryInventory();
  handleMeal.checkIfMealIsReady(req.query.mealID)
    .then((ready : boolean) => {
      res.status(200).json(ready);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.displayable = async (req : Request, res : Response) => {
  handleMeal.displayMealWithRecipeAndState()
    .then((mealsData : any) => {
      res.status(200).json(mealsData);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//PUT
exports.updateMeal = (req : Request, res: Response) => {
  const meal = new Meal({
    _id: req.params.id,
    recipeID: req.body.recipeID,
    numberOfLunchPlanned: req.body.numberOfLunchPlanned
  });

  Meal.updateOne({ _id: req.params.id }, meal)
    .then((result : any) => {
      if (result.modifiedCount > 0) {
        res.status(200).json(meal);
      } else {
        res.status(401).json({ message: "Pas de modification" });
      }
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//DELETE
exports.deleteMeal = (req : Request, res : Response) => {
  Meal.deleteOne({ _id: req.params.id })
    .then((result : any) => {
      if (result.deletedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
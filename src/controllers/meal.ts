import { Request, Response } from "express";

import { IDeleteOne } from "../models/mongoose";
import { IMeal } from "../models/meal";
import { IUpdateOne } from "../models/mongoose";

import { baseMeal } from "../compute/base/meal";
import { handleRecipe } from "../compute/handleRecipe";
import { handleMeal, IDisplayableMealStatus, IMealStatus } from "../compute/handleMeal";
import { updatePantryWhenMealIsDone } from "../compute/updatePantryWhenMealIsDone";

const registerIngredientOnTodo = require("../worker/registerIngredientsOnTodo");

export namespace mealController{
  //POST
  export async function writeMeal(req : Request, res : Response) {
    baseMeal.register(req.body.recipeID, req.body.numberOfLunchPlanned)
    .then(async function(result : any) {
      const ingredientsNeeded = await handleRecipe.getIngredientList(req.body.recipeID, req.body.numberOfLunchPlanned);
      registerIngredientOnTodo.registerIngredients(ingredientsNeeded);

      res.status(201).json(result);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function consumeMeal(req : Request, res : Response) {
    if (req.body.mealID) {
      await updatePantryWhenMealIsDone.updatePantryWhenMealsIsDone(req.body.mealID);
      const result : IDeleteOne = await baseMeal.deleteMeal(req.body.mealID);

      if (result.deletedCount > 0) {
        res.status(200).json({ status: "ok" });
      } else {
        res.status(500).send("Wrong ID");
      }
    }
  }

  //GET
  export async function readMeals(req : any, res : Response) {
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage : number = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedMeals : IMeal[] = [];

    baseMeal.getAllMeals(pageSize, currentPage)
    .then((documents : IMeal[]) => {
      fetchedMeals = documents;
      return baseMeal.count();
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
  export async function checkIfReady(req : any, res : Response) {
    await handleMeal.initPantryInventory();

    handleMeal.checkIfMealIsReady(req.query.mealID)
    .then((ready : IMealStatus) => {
      res.status(200).json(ready);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function displayable(req : Request, res : Response) {
    handleMeal.displayMealWithRecipeAndState()
    .then((mealsData : IDisplayableMealStatus[]) => {
      res.status(200).json(mealsData);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //PUT
  export async function updateMeal(req : Request, res: Response) {
    baseMeal.update(req.params.id, req.body.recipeID, req.body.numberOfLunchPlanned)
    .then((result : IUpdateOne) => {
      if (result.modifiedCount > 0) {
        res.status(200).json(result);
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
  export async function deleteMeal(req : Request, res : Response) {
    baseMeal.deleteOne(req.params.id)
    .then((result : IDeleteOne) => {
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
}
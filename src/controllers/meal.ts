import { Request, Response } from "express";

import { IDeleteOne } from "../models/mongoose";
import { IMeal } from "../models/meal";
import { IUpdateOne } from "../models/mongoose";

import { baseMeal } from "../compute/base/meal";
import { handleRecipe, IIngredientWithQuantity } from "../compute/handleRecipe";
import { handleMeal, IDisplayableMealStatus, IMealStatus } from "../compute/handleMeal";
import { updatePantryWhenMealIsDone } from "../compute/updatePantryWhenMealIsDone";

import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";

export namespace mealController{
  //POST
  export async function writeMeal(req : Request, res : Response) {

    let registerResult = await baseMeal.register(req.body.recipeID, req.body.numberOfLunchPlanned)
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });

    const ingredientsNeeded : IIngredientWithQuantity[] = await handleRecipe.getIngredientList(req.body.recipeID, req.body.numberOfLunchPlanned);
      
    await registerIngredientsOnTodo.registerIngredients(ingredientsNeeded);

    res.status(201).json(registerResult);
  }
  export async function consumeMeal(req : Request, res : Response) {
    if (req.body.mealID) {
      const result : IDeleteOne = await baseMeal.deleteMeal(req.body.mealID);

      if (result.deletedCount > 0) {
        await updatePantryWhenMealIsDone.updatePantryWhenMealsIsDone(req.body.mealID);
        res.status(200).json({ status: "ok" });
      } else {
        res.status(404).json({ errorMessage: "Wrong ID"});
      }
    }
    else
    {
      res.status(400).json({ errorMessage: "No mealID provided"});
    }
  }

  //GET
  export async function readMeals(req : any, res : Response) {
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage : number = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedMeals : IMeal[] | void = await baseMeal.getAllMeals(pageSize, currentPage)
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });

    let count = await baseMeal.count()
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });
    
    let data = {
      meals: fetchedMeals,
      count: count
    }

    res.status(200).json(data);
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
        res.status(401).json({ errorMessage: "Pas de modification" });
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
        res.status(401).json({ errorMessage: "Pas de modification" });
      }
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
}
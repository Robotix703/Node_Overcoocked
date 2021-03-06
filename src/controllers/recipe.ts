import { Request, Response } from "express";
import moment from 'moment';

import { IRecipe } from "../models/recipe";
import { IMeal } from "../models/meal";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";

import { baseRecipe } from "../compute/base/recipe";
import { baseMeal } from "../compute/base/meal";
import { handleRecipe, IIngredientWithQuantity, IPrettyRecipe } from "../compute/handleRecipe";

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

export namespace recipeController {
  //POST
  export function writeRecipe(req: any, res: Response){
    const url = protocol + '://' + req.get("host");

    baseRecipe.register(
      req.body.title,
      req.body.numberOfLunch,
      url + "/images/" + req.file.filename,
      req.body.category,
      req.body.duration,
      req.body.score ?? undefined,
      undefined
    )
    .then((result: any) => {
      res.status(201).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //GET
  export async function readRecipes(req: any, res: Response){
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedRecipes: IRecipe[] | void = await baseRecipe.filterRecipe(undefined, undefined, pageSize, currentPage)
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });

    let count = await baseRecipe.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });

    let data = {
      recipes: fetchedRecipes,
      count: count
    }

    res.status(200).json(data);
  }
  export async function getRecipeByID(req: Request, res: Response){
    baseRecipe.getRecipeByID(req.query.recipeID as string)
    .then((result: IRecipe) => {
      res.status(200).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getFilteredRecipe(req: any, res: Response){
    let fetchedRecipes: IRecipe[] | void = await baseRecipe.filterRecipe(
      req.query.category, 
      req.query.name, 
      parseInt(req.query.pageSize), 
      parseInt(req.query.currentPage)
    )
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let count : number | void = await baseRecipe.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let data = {
      recipes: fetchedRecipes,
      count: count
    };
    res.status(200).json(data);
  }
  export async function getRecipeByName(req: Request, res: Response){
    let fetchedRecipes: IRecipe[] | void = await baseRecipe.searchByName(req.query.name as string)
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let count : number | void = await baseRecipe.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let data = {
      recipes: fetchedRecipes,
      count: count
    }
    res.status(200).json(data);
  }
  export async function getPrettyRecipe(req: Request, res: Response){
    let recipeID: string | void;
    if (req.query.recipeID) {
      recipeID = req.query.recipeID as string;
    } else {
      if (req.query.mealID) {
        let meal : IMeal | void = await baseMeal.getMealByID(req.query.mealID as string)
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          });
          return;
        });

        if(meal)
        {
          recipeID = meal.recipeID;
        }
      }
    }

    if(recipeID)
    {
      handleRecipe.getPrettyRecipe(recipeID)
      .then((result: IPrettyRecipe) => {
        res.status(200).json(result);
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        });
        return;
      });
    }
    else
    {
      res.status(400).json({
        errorMessage: "RecipeID not found"
      });
    }
  }
  export async function getIngredientsNeeded(req: Request, res: Response){
    let recipeID: string | void;
    if (req.query.recipeID) {
      recipeID = req.query.recipeID as string;
    } else {
      if (req.query.mealID) {
        let meal : IMeal | void = await baseMeal.getMealByID(req.query.mealID as string)
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          })
        });

        if(meal)
        {
          recipeID = meal.recipeID;
        }
      }
    }

    if(recipeID)
    {
      let recipeData : IRecipe | void = await baseRecipe.getRecipeByID(recipeID)
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });

      if(recipeData)
      {
        handleRecipe.getIngredientList(recipeData._id, recipeData.numberOfLunch)
        .then((result: IIngredientWithQuantity[]) => {
          res.status(200).json(result);
        })
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          })
        });
      }
      else
      {
        res.status(400).json({
          errorMessage: "recipeData not found"
        });
      }
    }
    else
    {
      res.status(400).json({
        errorMessage: "RecipeID not found"
      });
    }
  }

  //PUT
  export function updateRecipe(req: Request, res: Response){
    baseRecipe.updateRecipe(
      req.params.id,
      req.body.title,
      req.body.numberOfLunch,
      req.body.imagePath,
      req.body.category,
      req.body.duration,
      req.body.score ?? undefined,
      req.body.lastCooked ? moment(req.body.expirationDate, "DD/MM/YYYY") : undefined
    )
    .then((result: IUpdateOne) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ status: "OK" });
      } else {
        res.status(401).json({ message: "Pas de modification" });
      }
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //DELETE
  export function deleteRecipe(req: Request, res: Response){
    baseRecipe.deleteOne(req.params.id)
    .then((result: IDeleteOne) => {
      if (result.deletedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
}
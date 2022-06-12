import { Request, Response } from "express";
import moment from 'moment';

import { IRecipe } from "../models/recipe";
import { IMeal } from "../models/meal";
import { IUpdateOne } from "../models/mongoose";

import { baseRecipe } from "../compute/base/recipe";
import { baseMeal } from "../compute/base/meal";
import { handleRecipe } from "../compute/handleRecipe";

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
  export function readRecipes(req: any, res: Response){
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedRecipes: IRecipe[] = [];

    baseRecipe.filterRecipe(undefined, undefined, pageSize, currentPage)
    .then((documents: IRecipe[]) => {
      fetchedRecipes = documents;
      return baseRecipe.count();
    })
    .then((count: number) => {
      res.status(200).json({ recipes: fetchedRecipes, count: count });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
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
    let fetchedRecipes: IRecipe[] = [];

    baseRecipe.filterRecipe(req.query.category, req.query.name, parseInt(req.query.pageSize), parseInt(req.query.currentPage))
    .then((documents: IRecipe[]) => {
      fetchedRecipes = documents;
      return baseRecipe.count();
    })
    .then((count: number) => {
      res.status(200).json({ recipes: fetchedRecipes, count: count });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getRecipeByName(req: Request, res: Response){
    let fetchedRecipes: IRecipe[] = [];
    
    baseRecipe.searchByName(req.query.name as string)
    .then((documents: IRecipe[]) => {
      fetchedRecipes = documents;
      return baseRecipe.count();
    })
    .then((count: number) => {
      res.status(200).json({ recipes: fetchedRecipes, count: count });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getPrettyRecipe(req: Request, res: Response){
    let recipeID: string = "";
    if (req.query.recipeID) {
      recipeID = req.query.recipeID as string;
    } else {
      if (req.query.mealID) {
        let meal : IMeal = await baseMeal.getMealByID(req.query.mealID as string);
        recipeID = meal.recipeID;
      }
    }

    handleRecipe.getPrettyRecipe(recipeID)
    .then((result: IRecipe) => {
      res.status(200).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getIngredientsNeeded(req: Request, res: Response){
    let recipeID: string = "";
    if (req.query.recipeID) {
      recipeID = req.query.recipeID as string;
    } else {
      if (req.query.mealID) {
        let meal : IMeal = await baseMeal.getMealByID(req.query.mealID as string);
        recipeID = meal.recipeID;
      }
    }

    let recipeData : IRecipe = await baseRecipe.getRecipeByID(recipeID);

    handleRecipe.getIngredientList(recipeData._id, recipeData.numberOfLunch)
    .then((result: any[]) => {
      res.status(200).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
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
    .then((result: any) => {
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
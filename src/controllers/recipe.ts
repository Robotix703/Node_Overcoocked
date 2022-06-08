import { Request, Response } from "express";
import moment from 'moment';
import { IRecipe } from "../models/recipe";

const Recipe = require('./../models/recipe');
const baseRecipe = require("../compute/base/recipe");
const baseMeal = require("../compute/base/meal");
const handleRecipe = require("../compute/handleRecipe");

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

//POST
export function writeRecipe(req: any, res: Response){
  const url = protocol + '://' + req.get("host");

  const recipe = new Recipe({
    title: req.body.title,
    numberOfLunch: req.body.numberOfLunch,
    imagePath: url + "/images/" + req.file.filename,
    category: req.body.category,
    duration: req.body.duration,
    score: req.body.score ?? undefined,
    lastCooked: undefined
  });

  recipe.save()
    .then((result: any) => {
      res.status(201).json({ id: result._id, recipe });
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

  const recipeQuery = Recipe.find();
  let fetchedRecipes: IRecipe[] = [];

  if (pageSize && currentPage) {
    recipeQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  recipeQuery
    .then((documents: IRecipe[]) => {
      fetchedRecipes = documents;
      return Recipe.count();
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
  baseRecipe.getRecipeByID(req.query.recipeID).then((result: IRecipe) => {
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
      return Recipe.count();
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
  
  baseRecipe.searchByName(req.query.name)
    .then((documents: IRecipe[]) => {
      fetchedRecipes = documents;
      return Recipe.count();
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
  let recipeID: any = "";
  if (req.query.recipeID) {
    recipeID = req.query.recipeID;
  } else {
    if (req.query.mealID) {
      let meal = await baseMeal.getMealByID(req.query.mealID);
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
  let recipeID: any = "";
  if (req.query.recipeID) {
    recipeID = req.query.recipeID;
  } else {
    if (req.query.mealID) {
      let meal = await baseMeal.getMealByID(req.query.mealID);
      recipeID = meal.recipeID;
    }
  }

  let recipeData = await baseRecipe.getRecipeByID(recipeID);

  handleRecipe.getIngredientList(recipeData._id, recipeData.numberOfLunch)
    .then((result: any) => {
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
    .then((result: any) => {
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
  Recipe.deleteOne({ _id: req.params.id })
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
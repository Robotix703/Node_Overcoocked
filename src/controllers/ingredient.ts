import { Request, Response } from "express";
import { ingredient } from "../models/ingredient";
const Ingredient = require('../models/ingredient');
const baseIngredient = require("../compute/base/ingredient");

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

//POST
export function writeIngredient(req: any, res: Response){
  const url = protocol + '://' + req.get("host");

  const ingredient = new Ingredient({
    name: req.body.name,
    imagePath: url + "/images/" + req.file.filename,
    consumable: req.body.consumable,
    category: req.body.category,
    unitOfMeasure: req.body.unitOfMeasure,
    shelfLife: req.body.shelfLife ? req.body.shelfLife : undefined,
    freezable: req.body.freezable
  });

  ingredient.save()
    .then((result: any) => {
      res.status(201).json({ id: result._id, ingredient: ingredient });
    })
    .catch((error: Error) => {
      res.status(500).json({
        message: error
      })
    });
}

//GET
export function readIngredients(req: any, res: Response){
  var fetchedIngredients: ingredient[] = [];
  baseIngredient.getFilteredIngredient(req.query.name, parseInt(req.query.pageSize), parseInt(req.query.currentPage))
    .then((documents: ingredient[]) => {
      fetchedIngredients = documents;
      return Ingredient.count();
    })
    .then((count: number) => {
      res.status(200).json({ ingredients: fetchedIngredients, ingredientCount: count });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export function consumableID(req: Request, res: Response){
  Ingredient.find({ consumable: true })
    .then((documents: ingredient[]) => {
      res.status(200).json({ IngredientsID: documents.map(e => e._id), count: documents.length });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export function searchByName(req: Request, res: Response){
  let fetchedIngredients: ingredient[] = [];

  Ingredient.find({ 'name': { "$regex": req.query.name, "$options": "i" } })
    .then((documents: ingredient[]) => {
      fetchedIngredients = documents;
      return Ingredient.count();
    })
    .then((count: number) => {
      res.status(200).json({ ingredients: fetchedIngredients, ingredientCount: count });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export async function getIngredientByID(req: Request, res: Response){
  baseIngredient.getIngredientByID(req.query.ingredientID)
    .then((ingredient: ingredient) => {
      res.status(200).json(ingredient);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export async function getAllIngredientsName(req: Request, res: Response){
  baseIngredient.getAllIngredientsName()
    .then((ingredientsName: string[]) => {
      res.status(200).json(ingredientsName);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export async function filteredIngredients(req: Request, res: Response){
  baseIngredient.getFilteredIngredient(req.query.category)
    .then((result: any) => {
      res.status(200).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export async function getAllIngredientForAutocomplete(req: Request, res: Response){
  baseIngredient.getAllIngredients()
  .then((result: any) => {
    let prettyIngredient = [];
    for(let element of result){
      prettyIngredient.push(element.name + " - " + element.unitOfMeasure);
    }
    res.status(200).json(prettyIngredient);
  })
  .catch((error: Error) => {
    res.status(500).json({
      errorMessage: error
    })
  });
}

//PUT
export function editIngredient(req: Request, res: Response){
  baseIngredient.updateIngredient(
    req.params.id,
    req.body.name,
    req.body.consumable,
    req.body.category,
    req.body.unitOfMeasure,
    req.body.shelfLife ?? -1,
    req.body.freezable
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
export function deleteIngredient(req: Request, res: Response){
  Ingredient.deleteOne({ _id: req.params.id })
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
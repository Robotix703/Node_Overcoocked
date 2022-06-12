import { Request, Response } from "express";
import { IIngredient } from "../models/ingredient";
import { baseIngredient } from "../compute/base/ingredient";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

export namespace ingredientController {
  //POST
  export async function writeIngredient(req: any, res: Response){
    const url = protocol + '://' + req.get("host");

    let result : any = await baseIngredient.register(
      req.body.name,
      url + "/images/" + req.file.filename,
      req.body.consumable,
      req.body.category,
      req.body.unitOfMeasure,
      req.body.shelfLife,
      req.body.freezable)
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
        return;
      });

    res.status(201).json(result);
  }

  //GET
  export function readIngredients(req: any, res: Response){
    var fetchedIngredients: IIngredient[] = [];

    baseIngredient.getFilteredIngredient(req.query.name, null, parseInt(req.query.pageSize), parseInt(req.query.currentPage))
      .then((documents: IIngredient[]) => {
        fetchedIngredients = documents;
        return baseIngredient.count();
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
  export async function consumableID(req: Request, res: Response){
    baseIngredient.getConsumableIngredients()
    .then((consumableIngredients : IIngredient[]) => {
      res.status(200).json({ IngredientsID: consumableIngredients.map(e => e._id), count: consumableIngredients.length });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
    });
  }
  export function searchByName(req: Request, res: Response){
    let fetchedIngredients: IIngredient[] = [];

    baseIngredient.findByName(req.query.name as string)
      .then((documents: IIngredient[]) => {
        fetchedIngredients = documents;
        return baseIngredient.count();
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
    baseIngredient.getIngredientByID(req.query.ingredientID as string)
      .then((ingredient: IIngredient) => {
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
    baseIngredient.getFilteredIngredient(req.query.name as string, req.query.category as string, null, null)
      .then((result: IIngredient[]) => {
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
    .then((result: IIngredient[]) => {
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
  export function deleteIngredient(req: Request, res: Response){
    baseIngredient.deleteOne(req.params.id)
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
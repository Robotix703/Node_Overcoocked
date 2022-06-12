import { Request, Response } from "express";
import moment from 'moment';

import { IPantry } from "../models/pantry";
import { IIngredient } from "../models/ingredient";
import { IUpdateOne } from "../models/mongoose";
import { IDeleteOne } from "../models/mongoose";

import { PantryInventory } from "../compute/pantryInventory";
import { baseIngredient } from "../compute/base/ingredient";
import { basePantry } from "../compute/base/pantry";
import { handlePantry } from "../compute/handlePantry";

const checkTodoList = require("../worker/checkTodoList");

export namespace pantryController {
  //POST
  export function writePantry(req: Request, res: Response){

    basePantry.register(req.body.ingredientID, req.body.quantity, req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null, req.body.frozen ?? false)
    .then((result: any) => {
      res.status(201).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function writePantryByIngredientName(req: Request, res: Response){
    const ingredientID : IIngredient = await baseIngredient.getIngredientByName(req.body.ingredientName);

    basePantry.register(ingredientID._id, req.body.quantity, req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null, req.body.frozen ?? false)
    .then((result: any) => {
      res.status(201).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function freezePantry(req: Request, res: Response){
    await handlePantry.freezePantry(req.body.pantryID);
    res.status(201).json({ result: "OK" });
  }
  export async function refreshTodoist(req: Request, res: Response){
    await checkTodoList.checkTodoList();
    res.status(201).json({ result: "OK" });
  }

  //GET
  export function readPantries(req: any, res: Response){
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedPantries: IPantry[] = [];

    basePantry.getAllPantries(pageSize, currentPage)
    .then((documents: IPantry[]) => {
      fetchedPantries = documents;
      return basePantry.count();
    })
    .then((count: number) => {
      res.status(200).json({ pantries: fetchedPantries, pantryCount: count });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export function quantityLeft(req: Request, res: Response){
    basePantry.getByIngredientID(req.query.ingredientID as string)
    .then((documents: IPantry[]) => {
      const fetchedPantries : IPantry[] = [...documents];

      let sum = 0;
      fetchedPantries.forEach((e) => {
        sum += e.quantity;
      })

      res.status(200).json({ quantityLeft: sum });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export function getNearestExpirationDate(req: Request, res: Response){
    basePantry.getByIngredientID(req.query.ingredientID as string)
    .then((documents: IPantry[]) => {
      const fetchedPantries : IPantry[] = [...documents];

      let nearestExpirationDate : Date = new Date();
      nearestExpirationDate.setFullYear(nearestExpirationDate.getFullYear() + 1);

      fetchedPantries.forEach((e) => {
        if (e.expirationDate < nearestExpirationDate) nearestExpirationDate = e.expirationDate;
      })

      res.status(200).json({ nearestExpirationDate: nearestExpirationDate });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getFullPantryInventory(req: Request, res: Response){
    PantryInventory.getFullInventory()
    .then((fullInventory: any) => {
      res.status(200).json(fullInventory);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getPantryByID(req: Request, res: Response){
    const pantry : IPantry = await basePantry.getPantryByID(req.query.pantryID as string);
    const ingredientName : string = await baseIngredient.getIngredientNameByID(pantry.ingredientID);

    res.status(200).json({
      _id: pantry._id,
      ingredientID: pantry.ingredientID,
      quantity: pantry.quantity,
      expirationDate: pantry.expirationDate || null,
      ingredientName: ingredientName,
      frozen: pantry.frozen
    });
  }

  //PUT
  export async function updatePantry(req: Request, res: Response){
    let ingredientID : string = "";
    if(req.body.ingredientName){
      let ingredient : IIngredient = await baseIngredient.getIngredientByName(req.body.ingredientName);
      ingredientID = ingredient._id;
    }

    basePantry.updatePantry(
      req.params.id,
      ingredientID,
      req.body.quantity,
      req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null,
      req.body.frozen
    )
    .then((result: IUpdateOne) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({status: "OK"});
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
  export function deletePantry(req: Request, res: Response){
    basePantry.deleteOne(req.params.id)
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
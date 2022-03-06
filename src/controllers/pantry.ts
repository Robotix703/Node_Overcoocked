import { Request, Response } from "express";
import moment from 'moment';
import { pantry } from "../models/pantry";
import { recipe } from "../models/recipe";

const Pantry = require('../models/pantry');
const pantryInventory = require("../compute/pantryInventory");
const baseIngredient = require("../compute/base/ingredient");
const basePantry = require("../compute/base/pantry");
const handlePantry = require("../compute/handlePantry");

const checkTodoList = require("../worker/checkTodoList");

//POST
export function writePantry(req: Request, res: Response){
  const pantry = new Pantry({
    ingredientID: req.body.ingredientID,
    quantity: req.body.quantity,
    expirationDate: req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null,
    frozen: req.body.frozen
  });

  pantry.save()
    .then((result: any) => {
      res.status(201).json({ id: result._id, pantry });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export async function writePantryByIngredientName(req: Request, res: Response){
  const ingredientID = await baseIngredient.getIngredientByName(req.body.ingredientName);
  const pantry = new Pantry({
    ingredientID: ingredientID._id,
    quantity: req.body.quantity,
    expirationDate: req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null,
    frozen: req.body.frozen ?? false
  });

  pantry.save()
    .then((result: any) => {
      res.status(201).json({ id: result._id, pantry });
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

  const pantryQuery = Pantry.find();
  let fetchedPantries: pantry[] = [];

  if (pageSize && currentPage) {
    pantryQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  pantryQuery
    .then((documents: pantry[]) => {
      fetchedPantries = documents;
      return Pantry.count();
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
  const ingredientID = req.query.ingredientID;

  Pantry.find({ ingredientID: ingredientID })
    .then((documents: pantry[]) => {
      const fetchedPantries = [...documents];
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
  const ingredientID = req.query.ingredientID;

  Pantry.find({ ingredientID: ingredientID })
    .then((documents: pantry[]) => {
      const fetchedPantries = [...documents];
      let nearestExpirationDate = new Date();
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
  pantryInventory.getFullInventory()
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
  const pantry = await basePantry.getPantryByID(req.query.pantryID);
  const ingredientName = await baseIngredient.getIngredientNameByID(pantry.ingredientID);

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
  let ingredientID = "";
  if(req.body.ingredientName){
    let ingredient = await baseIngredient.getIngredientByName(req.body.ingredientName);
    ingredientID = ingredient._id;
  }

  basePantry.updatePantry(
    req.params.id,
    ingredientID,
    req.body.quantity,
    req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null,
    req.body.frozen
  )
    .then((result: any) => {
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
  Pantry.deleteOne({ _id: req.params.id })
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
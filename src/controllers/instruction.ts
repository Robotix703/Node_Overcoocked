import { Request, Response } from "express";
import { IInstruction } from "../models/instruction";
const Instruction = require('./../models/instruction');

const handleRecipe = require("../compute/handleRecipe");
const baseIngredient = require("../compute/base/ingredient");
const baseInstruction = require("../compute/base/instruction");
const handleInstructions = require("../compute/handleInstructions");

//POST
export function writeInstruction(req: Request, res: Response){
  const instruction = new Instruction({
    text: req.body.text,
    recipeID: req.body.recipeID,
    ingredientsID: req.body.ingredients,
    quantity: req.body.quantity,
    order: req.body.order,
    cookingTime: req.body.cookingTime ?? undefined
  });

  instruction.save()
    .then((result: any) => {
      res.status(201).json({ id: result._id, instruction: instruction });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export async function writeInstructionByIngredientName(req: Request, res: Response){
  const ingredientsName = req.body.ingredients.map((e: any) => e.ingredientName);
  const ingredientsQuantity = req.body.ingredients.map((e: any) => e.quantity);

  const ingredientsID: string[] = await baseIngredient.getIngredientsIDByName(ingredientsName);

  if (ingredientsID[0]) {
    const instruction = new Instruction({
      text: req.body.text,
      recipeID: req.body.recipeID,
      ingredientsID: ingredientsID,
      quantity: ingredientsQuantity,
      order: req.body.order,
      cookingTime: req.body.cookingTime ?? undefined
    })

    instruction.save()
      .then((result: any) => {
        res.status(201).json({ id: result._id, instruction });
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
  } else {
    res.status(500).json({
      errorMessage: "No valid ingredient"
    });
  }
}

//GET
export function readInstructions(req: any, res: Response){
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const instructionQuery = Instruction.find();
  let fetchedInstructions: IInstruction[] = [];

  if (pageSize && currentPage) {
    instructionQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  instructionQuery
    .then((documents: IInstruction[]) => {
      fetchedInstructions = documents;
      return Instruction.count();
    })
    .then((count: number) => {
      res.status(200).json({ instructions: fetchedInstructions, instructionCount: count });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export function getByRecipeID(req: Request, res: Response){
  handleRecipe.getInstructionsByRecipeID(req.query.recipeID)
    .then((instructions: IInstruction[]) => {
      res.status(200).json(instructions);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
export async function getInstructionCountForRecipe(req: Request, res: Response){
  let count = await handleInstructions.getInstructionCountForRecipe(req.query.recipeID);
  res.status(200).json(count);
}
export async function getInstructionByID(req: Request, res: Response){
  handleInstructions.getPrettyInstructionByID(req.query.instructionID)
  .then((instruction: IInstruction) => {
    res.status(200).json(instruction);
  })
  .catch((error: Error) => {
    res.status(500).json({
      errorMessage: error
    })
  });
}

//PUT
export async function updateInstruction(req: Request, res: Response){
  const ingredientsName = req.body.ingredients.map((e: any) => e.ingredientName);
  const ingredientsQuantity = req.body.ingredients.map((e: any) => e.quantity);

  const ingredientsID = await baseIngredient.getIngredientsIDByName(ingredientsName);
  
  baseInstruction.updateInstruction(
    req.params.id,
    req.body.text,
    undefined,
    ingredientsID,
    ingredientsQuantity,
    req.body.order,
    req.body.cookingTime
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
export function deleteInstruction(req: Request, res: Response){
  Instruction.deleteOne({ _id: req.params.id })
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
import { IUpdateOne } from "../../models/mongoose";
import { instruction } from "../../models/instruction";

const Instruction = require('../../models/instruction');

exports.getInstructionByID = async function(instructionID : string) : Promise<instruction> {
    return Instruction.findById(instructionID);
}

exports.getInstructionByRecipeID = async function(recipeID : string) : Promise<instruction>{
    return Instruction.find({ 'recipeID': recipeID });
}

exports.updateInstruction = async function(_id : string, text : string, recipeID : string, ingredientsID : string, quantity : number, order : number, cookingTime : number) : Promise<IUpdateOne>{
    let elementToUpdate : any = { _id: _id };

    if(text) elementToUpdate.text = text;
    if(recipeID) elementToUpdate.recipeID = recipeID;
    if(ingredientsID) elementToUpdate.ingredientsID = ingredientsID;
    if(quantity) elementToUpdate.quantity = quantity;
    if(order) elementToUpdate.order = order;
    if(cookingTime) elementToUpdate.cookingTime = cookingTime;

    return Instruction.updateOne({ _id: _id }, elementToUpdate);
}
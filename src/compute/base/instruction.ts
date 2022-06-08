import { IUpdateOne } from "../../models/mongoose";
import { IInstruction } from "../../models/instruction";

const Instruction = require('../../models/instruction');

export namespace baseInstruction {

    export async function getInstructionByID(instructionID : string) : Promise<IInstruction> {
        return Instruction.findById(instructionID);
    }

    export async function getInstructionByRecipeID(recipeID : string) : Promise<IInstruction>{
        return Instruction.find({ 'recipeID': recipeID });
    }

    export async function updateInstruction(_id : string, text : string, recipeID : string, ingredientsID : string, quantity : number, order : number, cookingTime : number) : Promise<IUpdateOne>{
        let elementToUpdate : any = { _id: _id };

        if(text) elementToUpdate.text = text;
        if(recipeID) elementToUpdate.recipeID = recipeID;
        if(ingredientsID) elementToUpdate.ingredientsID = ingredientsID;
        if(quantity) elementToUpdate.quantity = quantity;
        if(order) elementToUpdate.order = order;
        if(cookingTime) elementToUpdate.cookingTime = cookingTime;

        return Instruction.updateOne({ _id: _id }, elementToUpdate);
    }
}
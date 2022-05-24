const Instruction = require('../../models/instruction');

exports.getInstructionByID = async function(instructionID : string){
    return Instruction.findById(instructionID);
}

exports.getInstructionByRecipeID = async function(recipeID : string){
    return Instruction.find({ 'recipeID': recipeID });
}

exports.updateInstruction = async function(_id : string, text : string, recipeID : string, ingredientsID : string, quantity : number, order : number, cookingTime : number){
    let elementToUpdate : any = { _id: _id };

    if(text) elementToUpdate.text = text;
    if(recipeID) elementToUpdate.recipeID = recipeID;
    if(ingredientsID) elementToUpdate.ingredientsID = ingredientsID;
    if(quantity) elementToUpdate.quantity = quantity;
    if(order) elementToUpdate.order = order;
    if(cookingTime) elementToUpdate.cookingTime = cookingTime;

    return Instruction.updateOne({ _id: _id }, elementToUpdate);
}
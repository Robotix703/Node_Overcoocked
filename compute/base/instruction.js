const Instruction = require('./../models/instruction');

exports.getInstructionByID = async function(instructionID){
    return Instruction.findById(instructionID);
}

exports.getInstructionByRecipeID = async function(recipeID){
    return Instruction.find({ 'recipeID': recipeID });
}
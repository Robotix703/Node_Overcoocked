const baseInstruction = require("./base/instruction");

exports.getInstructionCountForRecipe = async function(recipeID){
    let instructions = await baseInstruction.getInstructionByRecipeID(recipeID);

    return instructions.length;
}
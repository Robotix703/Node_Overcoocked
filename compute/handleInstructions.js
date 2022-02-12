const baseInstruction = require("./base/instruction");
const baseIngredient = require("./base/ingredient");

exports.getInstructionCountForRecipe = async function(recipeID){
    let instructions = await baseInstruction.getInstructionByRecipeID(recipeID);

    return instructions.length;
}

exports.getPrettyInstructionByID = async function(instructionID){
    let instruction = await baseInstruction.getInstructionByID(instructionID);
    let ingredients = await baseIngredient.getIngredientsByID(instruction.ingredientsID);

    let prettyInstruction = {
        _id: instruction._id,
        text: instruction.text,
        composition: [],
        order: instruction.order,
        cookingTime: instruction.cookingTime
    }

    for(let i = 0; i < ingredients.length; i++){
        prettyInstruction.composition.push({
            name: ingredients[i].name,
            imagePath: ingredients[i].imagePath,
            quantity: instruction.quantity[i]
        })
    }

    return prettyInstruction;
}
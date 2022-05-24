const baseInstructionForInstruction = require("./base/instruction");
const baseIngredientForInstruction = require("./base/ingredient");

exports.getInstructionCountForRecipe = async function(recipeID : string){
    let instructions = await baseInstructionForRecipe.getInstructionByRecipeID(recipeID);

    return instructions.length;
}

exports.getPrettyInstructionByID = async function(instructionID : string){
    let instruction = await baseInstructionForRecipe.getInstructionByID(instructionID);
    let ingredients = await baseIngredientForRecipe.getIngredientsByID(instruction.ingredientsID);

    let prettyInstruction : any = {
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
            quantity: instruction.quantity[i],
            unitOfMeasure: ingredients[i].unitOfMeasure
        })
    }

    return prettyInstruction;
}
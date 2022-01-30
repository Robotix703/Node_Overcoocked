const baseIngredient = require("./base/ingredient");
const baseInstruction = require("./base/instruction");

getIngredientIDFromInstruction = async function (instructionID) {
    const instruction = await baseInstruction.getInstructionByID(instructionID);

    let ingredientsNeeded = [];
    instruction.ingredientsID.forEach((ingredient, index) => {
        ingredientsNeeded.push({
            ingredientID: ingredient,
            quantity: instruction.quantity[index]
        });
    });
    return ingredientsNeeded;
}

concatList = function (originalList, additionList) {
    additionList.forEach((elementToAdd) => {
        let existingIngredient = originalList.find(e => e.ingredientID == elementToAdd.ingredientID);

        if (existingIngredient) existingIngredient.quantity += elementToAdd.quantity;
        else originalList.push(elementToAdd);
    })
}

adaptQuantity = function (ingredientList, numberOfLunch) {
    ingredientList.forEach((ingredient) => {
        ingredient.quantity *= numberOfLunch;
    });
}

exports.getIngredientList = async function (recipeID, numberOfLunch) {
    const instructions = await baseInstruction.getInstructionByRecipeID(recipeID);

    let ingredientsNeeded = [];
    for (instruction of instructions) {

        let newIngredients = [];
        for (let i = 0; i < instruction.ingredientsID.length; i++) {
            const ingredientsName = await baseIngredient.getIngredientsNameFromIDs([instruction.ingredientsID[i]]);
            newIngredients.push({
                ingredientID: instruction.ingredientsID[i],
                ingredientName: ingredientsName[0],
                quantity: instruction.quantity[i]
            });
        }

        if (!newIngredients.reason) {
            adaptQuantity(newIngredients, numberOfLunch);
            concatList(ingredientsNeeded, newIngredients);
        }
    }
    return ingredientsNeeded;
}

exports.getIngredientsName = async function (recipeID) {
    const instructions = await baseInstruction.getInstructionByRecipeID(recipeID);

    let newInstruction = [];
    for (instruction of instructions) {
        const ingredientsID = await getIngredientIDFromInstruction(instruction._id);
        const ingredientsName = await baseIngredient.getIngredientsNameFromIDs(ingredientsID.map(e => e.ingredientID));

        let composition = [];
        for (let i = 0; i < ingredientsName.length; i++) {
            composition.push({ name: ingredientsName[i], quantity: instruction.quantity[i] });
        }
        
        newInstruction.push({
            _id: instruction._id,
            text: instruction.text,
            recipeID: instruction.recipeID,
            composition: composition
        });
    }
    return newInstruction;
}
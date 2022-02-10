const baseIngredient = require("./base/ingredient");
const baseInstruction = require("./base/instruction");
const baseRecipe = require("./base/recipe");

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
        let existingIngredient = originalList.find(e => e.ingredient._id == elementToAdd.ingredient._id);

        if (existingIngredient) existingIngredient.quantity += elementToAdd.quantity;
        else originalList.push(elementToAdd);
    })
}

adaptQuantity = function (ingredientList, numberOfLunch, numberOfLunchRecipe) {
    ingredientList.forEach((ingredient) => {
        ingredient.quantity *= (numberOfLunch / numberOfLunchRecipe);
    });
}

sortInstructions = function(x, y){
    if (x.order < y.order) return -1;
    if (x.order > y.order) return 1;
    return 0;
}

exports.getIngredientList = async function (recipeID, numberOfLunch) {
    const instructions = await baseInstruction.getInstructionByRecipeID(recipeID);
    const recipe = await baseRecipe.getRecipeByID(recipeID);

    let ingredientsNeeded = [];
    for (instruction of instructions) {

        let newIngredients = [];
        for (let i = 0; i < instruction.ingredientsID.length; i++) {
            const ingredient = await baseIngredient.getIngredientByID(instruction.ingredientsID[i]);
            newIngredients.push({
                ingredient: ingredient,
                quantity: instruction.quantity[i]
            });
        }

        if (!newIngredients.reason) {
            adaptQuantity(newIngredients, numberOfLunch, recipe.numberOfLunch);
            concatList(ingredientsNeeded, newIngredients);
        }
    }
    return ingredientsNeeded;
}

exports.getInstructionsByRecipeID = async function (recipeID) {
    let instructions = await baseInstruction.getInstructionByRecipeID(recipeID);
    instructions.sort(sortInstructions);

    let newInstruction = [];
    for (instruction of instructions) {
        const ingredientsID = await getIngredientIDFromInstruction(instruction._id);
        const ingredients = await baseIngredient.getIngredientsByID(ingredientsID.map(e => e.ingredientID));

        let composition = [];
        for (let i = 0; i < ingredients.length; i++) {
            composition.push(
                { 
                    name: ingredients[i].name,
                    imagePath: ingredients[i].imagePath,
                    quantity: instruction.quantity[i]
                });
        }
        
        newInstruction.push({
            _id: instruction._id,
            text: instruction.text,
            recipeID: instruction.recipeID,
            composition: composition,
            order: instruction.order,
            cookingTime: instruction.cookingTime
        });
    }
    return newInstruction;
}

exports.getPrettyRecipe = async function(recipeID){
    let instructions = await this.getInstructionsByRecipeID(recipeID);
    let recipeData = await baseRecipe.getRecipeByID(recipeID);
    
    return {
        _id: recipeData._id,
        title: recipeData.title,
        numberOfLunch: recipeData.numberOfLunch,
        category: recipeData.category,
        duration: recipeData.duration,
        score: recipeData.score,
        instructions: instructions
    };
}
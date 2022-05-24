const baseIngredientForRecipe = require("./base/ingredient");
const baseInstructionForRecipe = require("./base/instruction");
const baseRecipe = require("./base/recipe");

const getIngredientIDFromInstruction = async function (instructionID : string) {
    const instruction = await baseInstructionForRecipe.getInstructionByID(instructionID);

    let ingredientsNeeded : any[] = [];
    instruction.ingredientsID.forEach((ingredient : any, index : number) => {
        ingredientsNeeded.push({
            ingredientID: ingredient,
            quantity: instruction.quantity[index]
        });
    });
    return ingredientsNeeded;
}

const concatList = function (originalList : any, additionList : any) {
    additionList.forEach((elementToAdd : any) => {
        let existingIngredient = originalList.find((e : any) => e.ingredient._id.toString() == elementToAdd.ingredient._id.toString());

        if (existingIngredient) existingIngredient.quantity += elementToAdd.quantity;
        else originalList.push(elementToAdd);
    })
}

const adaptQuantity = function (ingredientList : any, numberOfLunch : number, numberOfLunchRecipe : number) {
    ingredientList.forEach((ingredient : any) => {
        ingredient.quantity *= (numberOfLunch / numberOfLunchRecipe);
    });
}

const sortInstructions = function(x : any, y : any){
    if (x.order < y.order) return -1;
    if (x.order > y.order) return 1;
    return 0;
}

exports.getIngredientList = async function (recipeID : string, numberOfLunch : number) {
    const instructions = await baseInstructionForRecipe.getInstructionByRecipeID(recipeID);
    const recipe = await baseRecipe.getRecipeByID(recipeID);

    let ingredientsNeeded : any[] = [];
    for (let instruction of instructions) {

        let newIngredients = [];
        for (let i = 0; i < instruction.ingredientsID.length; i++) {
            const ingredient = await baseIngredientForRecipe.getIngredientByID(instruction.ingredientsID[i]);
            newIngredients.push({
                ingredient: ingredient,
                quantity: instruction.quantity[i]
            });
        }

        adaptQuantity(newIngredients, numberOfLunch, recipe.numberOfLunch);
        concatList(ingredientsNeeded, newIngredients);
    }
    return ingredientsNeeded;
}

exports.getInstructionsByRecipeID = async function (recipeID : string) {
    let instructions = await baseInstructionForRecipe.getInstructionByRecipeID(recipeID);
    instructions.sort(sortInstructions);

    let newInstruction = [];
    for (let instruction of instructions) {
        const ingredientsID = await getIngredientIDFromInstruction(instruction._id);
        const ingredients = await baseIngredientForRecipe.getIngredientsByID(ingredientsID.map(e => e.ingredientID));

        let composition = [];
        for (let i = 0; i < ingredients.length; i++) {
            composition.push(
                { 
                    name: ingredients[i].name,
                    imagePath: ingredients[i].imagePath,
                    quantity: instruction.quantity[i],
                    unitOfMeasure: ingredients[i].unitOfMeasure
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

exports.getPrettyRecipe = async function(recipeID : string){
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
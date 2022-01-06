const Recipe = require('./../models/recipe');
const Instruction = require('./../models/instruction');

getIngredientFromInstruction = async function (instructionID) {
    return Instruction.findById(instructionID)
    .then((instruction) => {
        let ingredientsNeeded = [];
        instruction.ingredientsID.forEach((ingredient, index) => {
            ingredientsNeeded.push({
                ingredientID: ingredient,
                quantity: instruction.quantity[index]
            })
        })
        return ingredientsNeeded;
    })
    .catch(error => {
        return error;
    });
}

concatList = function (originalList, additionList){
    additionList.forEach((elementToAdd) => {
        let existingIngredient = originalList.find(e => e.ingredientID == elementToAdd.ingredientID);

        if(existingIngredient){
            existingIngredient.quantity += elementToAdd.quantity;
        } else {
            originalList.push(elementToAdd);
        }
    })
}

adaptQuantity = function(ingredientList, numberOfLunch){
    ingredientList.forEach((ingredient) => {
        ingredient.quantity *= numberOfLunch;
    })
}


exports.getIngredientList = async function(recipeID, numberOfLunch){
    return Recipe.findById(recipeID)
      .then(async function(recipe){
        let ingredientsNeeded = [];

        let fetchedRecipe = recipe;
        for(instructionID of fetchedRecipe.instructionsID){
            let newIngredients = await getIngredientFromInstruction(instructionID);

            if(!newIngredients.reason) {
                adaptQuantity(newIngredients, numberOfLunch);
                concatList(ingredientsNeeded, newIngredients);
            }
        }

        return ingredientsNeeded;
      })
      .catch(error => {
        return error;
      });
}

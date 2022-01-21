const Recipe = require('./../models/recipe');
const Instruction = require('./../models/instruction');
const Ingredient = require("./../models/ingredient");

getIngredientIDFromInstruction = async function (instructionID) {
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

concatList = function (originalList, additionList) {
    additionList.forEach((elementToAdd) => {
        let existingIngredient = originalList.find(e => e.ingredientID == elementToAdd.ingredientID);

        if (existingIngredient) {
            existingIngredient.quantity += elementToAdd.quantity;
        } else {
            originalList.push(elementToAdd);
        }
    })
}

adaptQuantity = function (ingredientList, numberOfLunch) {
    ingredientList.forEach((ingredient) => {
        ingredient.quantity *= numberOfLunch;
    })
}

getIngredientsNameFromID = async function (ingredientsID) {

    let ingredientsName = [];

    for (ingredientID of ingredientsID) {
        let ingredientName = await Ingredient.findById(ingredientID)
            .then(documents => {
                return documents.name;
            })
            .catch(error => {
                console.log({
                    errorMessage: error
                })
            });

        ingredientsName.push(ingredientName);
    }
    return ingredientsName;
}


exports.getIngredientList = async function (recipeID, numberOfLunch) {
    return Instruction.find({ 'recipeID': recipeID })
        .then(async function (instructions) {
            let ingredientsNeeded = [];
            for (instruction of instructions) {

                let newIngredients = [];
                for(let i = 0 ; i < instruction.ingredientsID.length ; i++)
                {
                    let ingredientsName = await getIngredientsNameFromID([instruction.ingredientsID[i]]);
                    newIngredients.push({
                        ingredientID: instruction.ingredientsID[i],
                        ingredientName: ingredientsName[0],
                        quantity: instruction.quantity[i]
                    })
                }

                if (!newIngredients.reason) {
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

exports.getIngredientsName = async function (recipeID) {
    return Instruction.find({ 'recipeID': recipeID })
        .then(async function (instructions) {
            let newInstruction = [];
            for (instruction of instructions) {
                let ingredientsID = await getIngredientIDFromInstruction(instruction._id);
                let ingredientsName = await getIngredientsNameFromID(ingredientsID.map(e => e.ingredientID));
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
        })
        .catch(error => {
            return error;
        });
}
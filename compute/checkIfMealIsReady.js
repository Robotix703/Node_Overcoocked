const pantryInventory = require("./pantryInventory");
const recipeIngredientsNeeded = require("./recipeIngredientsNeeded");

const Meal = require("../models/meal");

let g_pantryInventory = [];

exports.initPantryInventory = async function(){
    g_pantryInventory = await pantryInventory.getInventory();
}

async function getRecipeID(mealID){
    return Meal.findById(mealID).then((documents) =>{
        return documents;
    });
}

function checkDisponibility(ingredientID, quantity){
    let ingredientFound = g_pantryInventory.find(e => e.ingredientID == ingredientID);

    if(ingredientFound){
        return quantity < ingredientFound.quantityLeft;
    }else{
        return false
    }
}

exports.checkIfMealIsReady = async function(mealID){
    let meal = await getRecipeID(mealID);

    let ingredientsNeeded = await recipeIngredientsNeeded.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);

    for(ingredient of ingredientsNeeded){
        if(!checkDisponibility(ingredient.ingredientID, ingredient.quantity)){
            return false;
        }
    }
    return true;
}
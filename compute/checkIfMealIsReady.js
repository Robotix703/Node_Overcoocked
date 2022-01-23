const pantryInventory = require("./pantryInventory");
const recipeIngredientsNeeded = require("./recipeIngredientsNeeded");

const baseMeal = require("./base/meal");
const baseRecipe = require("./base/recipe");

let g_pantryInventory = [];

exports.initPantryInventory = async function(){
    g_pantryInventory = await pantryInventory.getInventory();
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
    const meal = await baseMeal.getMealByID(mealID);

    const ingredientsNeeded = await recipeIngredientsNeeded.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);

    for(ingredient of ingredientsNeeded){
        if(!checkDisponibility(ingredient.ingredientID, ingredient.quantity)){
            return false;
        }
    }
    return true;
}

exports.checkMealList = async function(){
    let allMeals = await baseMeal.getAllMeals();

    let mealState = [];
    for(oneMeal of allMeals){
        let recipe = await baseRecipe.getRecipeByID(oneMeal.recipeID);
        let mealReady = await this.checkIfMealIsReady(oneMeal._id);

        mealState.push({
            title: recipe.title,
            state: mealReady? "prête" : "pas prête"
        })
    }
    return mealState;
}
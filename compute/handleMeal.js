const pantryInventory = require("./pantryInventory");
const recipeIngredientsNeeded = require("./handleRecipe");

const baseMeal = require("./base/meal");
const baseRecipe = require("./base/recipe");

let g_pantryInventory = [];

exports.initPantryInventory = async function(){
    g_pantryInventory = await pantryInventory.getInventory();
}

function checkDisponibility(ingredientID, quantity){
    const ingredientFound = g_pantryInventory.find(e => e.ingredientID.toString() == ingredientID.toString());
    if(ingredientFound) return quantity < ingredientFound.quantityLeft;
    
    return false;
}

exports.checkIfMealIsReady = async function(mealID){
    const meal = await baseMeal.getMealByID(mealID);
    const ingredientsNeeded = await recipeIngredientsNeeded.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);

    for(ingredient of ingredientsNeeded){
        if(ingredient.ingredient.consumable)
        {
            if(!checkDisponibility(ingredient.ingredient._id, ingredient.quantity)) return false;
        }
    }
    return true;
}

exports.checkMealList = async function(){
    const allMeals = await baseMeal.getAllMeals();
    await this.initPantryInventory();

    let mealState = [];
    for(oneMeal of allMeals){
        const recipe = await baseRecipe.getRecipeByID(oneMeal.recipeID);
        const mealReady = await this.checkIfMealIsReady(oneMeal._id);

        mealState.push({
            title: recipe.title,
            ready: mealReady
        });
    }
    return mealState;
}

exports.displayMealWithRecipeAndState = async function(){
    const allMeals = await baseMeal.getAllMeals();
    await this.initPantryInventory();

    let mealData = [];

    for(meal of allMeals){
        const recipeData = await baseRecipe.getRecipeByID(meal.recipeID);
        const mealState = await this.checkIfMealIsReady(meal._id);

        mealData.push({
            _id: meal._id,
            title: recipeData.title,
            numberOfLunch: meal.numberOfLunchPlanned,
            imagePath: recipeData.imagePath,
            state: mealState
        });
    }
    return mealData;
}
const pantryInventory = require("./pantryInventory");
const recipeIngredientsNeeded = require("./handleRecipe");

const baseMeal = require("./base/meal");
const baseRecipe = require("./base/recipe");

let g_pantryInventory = [];

exports.initPantryInventory = async function(){
    g_pantryInventory = await pantryInventory.getInventory();
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function checkDisponibility(ingredientID, quantity){
    const ingredientFound = g_pantryInventory.find(e => e.ingredientID.toString() == ingredientID.toString());
    if(ingredientFound){
        if(quantity <= ingredientFound.quantityLeft){
            let dateNow = new Date();
            dateNow = dateNow.addDays(3);

            if(!ingredientFound.expirationDate) return 0;
            
            if(ingredientFound.expirationDate.getTime() < dateNow.getTime()){
                return -1;
            }
            return 0;
        }
        return -2;
    }else{
        return -2;
    }
}

exports.checkIfMealIsReady = async function(mealID){
    const meal = await baseMeal.getMealByID(mealID);
    const ingredientsNeeded = await recipeIngredientsNeeded.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);

    let ingredientAvailable = [];
    let ingredientUnavailable = [];
    let ingredientAlmostExpire = [];

    for(ingredient of ingredientsNeeded){
        if(ingredient.ingredient.consumable)
        {
            let state = checkDisponibility(ingredient.ingredient._id, ingredient.quantity);

            if(state == 0) ingredientAvailable.push(ingredient);
            if(state == -1) ingredientAlmostExpire.push(ingredient);
            if(state == -2) ingredientUnavailable.push(ingredient);
        }
    }
    return {
        ingredientAvailable: ingredientAvailable,
        ingredientAlmostExpire: ingredientAlmostExpire,
        ingredientUnavailable: ingredientUnavailable
    };
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
            state: mealReady
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

exports.getMealNumber = async function(){
    const allMeals = await baseMeal.getAllMeals();
    return allMeals.length;
}
const baseMeal = require("./base/meal");
const baseRecipe = require("./base/recipe");

const checkIfMealIsReady = require("./checkIfMealIsReady");

exports.displayMealWithRecipeAndState = async function(){
    let allMeals = await baseMeal.getAllMeals();

    await checkIfMealIsReady.initPantryInventory();

    let mealData = [];

    for(meal of allMeals){
        let recipeData = await baseRecipe.getRecipeByID(meal.recipeID);

        let mealState = await checkIfMealIsReady.checkIfMealIsReady(meal._id);

        mealData.push({
            _id: meal._id,
            title: recipeData.title,
            numberOfLunch: meal.numberOfLunchPlanned,
            imagePath: recipeData.imagePath,
            state: mealState
        })
    }

    return mealData;
}
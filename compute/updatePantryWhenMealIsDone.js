const baseMeal = require("./base/meal");
const basePantry = require("./base/pantry");
const recipeIngredientsNeeded = require("./recipeIngredientsNeeded");

function comparePantriesByQuantity(x, y){
    if(x.quantity > y.quantity) return 1;

    if(x.quantity < y.quantity) return -1;

    return 0;
}

function comparePantriesByExpirationDate(x, y){
    if(x.expirationDate == undefined && y.expirationDate == undefined) return comparePantriesByQuantity(x, y);

    if(x.expirationDate == undefined) return 1;

    if(y.expirationDate == undefined) return -1;

    if(x.expirationDate < y.expirationDate) return 1;

    if(x.expirationDate > y.expirationDate) return -1;

    return comparePantriesByQuantity(x, y);
}

async function consumeIngredientFromPantry(ingredientID, quantity){
    let quantityToConsume = quantity;
    let allPantry = await basePantry.getAllPantryByIngredientID(ingredientID);

    allPantry = allPantry.sort(comparePantriesByExpirationDate);

    while(quantityToConsume > 0){
        if(allPantry[0].quantity > quantityToConsume){
            //Update pantry
            allPantry[0].quantity -= quantityToConsume;
            await basePantry.updatePantry(allPantry[0]);

            quantityToConsume = 0;
        }else{
            //Delete pantry
            await basePantry.deletePantryByID(allPantry[0]._id);

            quantityToConsume -= allPantry[0].quantity;
            allPantry.shift();
        }

        if(allPantry.length <= 0) quantityToConsume = 0;
    }
}

exports.updatePantryWhenMealsIsDone = async function(mealID){
    const meal = await baseMeal.getMealByID(mealID);

    const ingredientsNeeded = await recipeIngredientsNeeded.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);
    for(ingredient of ingredientsNeeded){
        await consumeIngredientFromPantry(ingredient.ingredientID, ingredient.quantity);
    }
}
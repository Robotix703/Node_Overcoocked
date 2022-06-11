import { IMeal } from "../models/meal";
import { IPantry } from "../models/pantry";

import { baseMeal } from "./base/meal";
import { basePantry } from "./base/pantry";
import { baseRecipe } from "./base/recipe";

import { handleRecipe } from "./handleRecipe";

function comparePantriesByQuantity(x : any, y : any) : number {
    if(x.quantity > y.quantity) return 1;

    if(x.quantity < y.quantity) return -1;

    return 0;
}

function comparePantriesByExpirationDate(x : any, y : any) : number {
    if(x.expirationDate == undefined && y.expirationDate == undefined) return comparePantriesByQuantity(x, y);

    if(x.expirationDate == undefined) return 1;

    if(y.expirationDate == undefined) return -1;

    if(x.expirationDate < y.expirationDate) return 1;

    if(x.expirationDate > y.expirationDate) return -1;

    return comparePantriesByQuantity(x, y);
}

async function consumeIngredientFromPantry(ingredientID : string, quantity : number) : Promise<void> {
    let quantityToConsume : number = quantity;
    let allPantry : IPantry[] = await basePantry.getAllPantryByIngredientID(ingredientID);

    allPantry = allPantry.sort(comparePantriesByExpirationDate);

    while(quantityToConsume > 0){
        if(allPantry[0].quantity > quantityToConsume){
            //Update pantry
            allPantry[0].quantity -= quantityToConsume;
            await basePantry.updatePantryWithPantry(allPantry[0]);

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

export namespace updatePantryWhenMealIsDone {

    export async function updatePantryWhenMealsIsDone(mealID : string) : Promise<void> {
        const meal : IMeal = await baseMeal.getMealByID(mealID);
    
        await baseRecipe.updateLastCooked(meal.recipeID);
    
        const ingredientsNeeded : any[] = await handleRecipe.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);
        for(let ingredient of ingredientsNeeded){
            if(ingredient.consumable)
            {
                await consumeIngredientFromPantry(ingredient.ingredient._id, ingredient.quantity);
            }
        }
    }
}
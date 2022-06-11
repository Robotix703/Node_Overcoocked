const pantryInventory = require("./pantryInventory");
const recipeIngredientsNeeded = require("./handleRecipe");

import { IRecipe } from "../models/recipe";
import { IMeal } from "../models/meal";
import { baseMeal } from "./base/meal";
import { baseRecipe } from "./base/recipe";

let g_pantryInventory : any = [];

function checkDisponibility(ingredientID : string, quantity : number) : number {
    const ingredientFound = g_pantryInventory.find((e : any) => e.ingredientID.toString() == ingredientID.toString());
    if(ingredientFound){
        if(quantity <= ingredientFound.quantityLeft){
            let dateNow : Date = new Date();
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

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export namespace handleMeal {

    export async function initPantryInventory() : Promise<void> {
        g_pantryInventory = await pantryInventory.getInventory();
    }

    export async function checkIfMealIsReady(mealID : string) : Promise<any> {
        const meal : IMeal = await baseMeal.getMealByID(mealID);
        const ingredientsNeeded = await recipeIngredientsNeeded.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);
    
        let ingredientAvailable = [];
        let ingredientUnavailable = [];
        let ingredientAlmostExpire = [];
    
        for(let ingredient of ingredientsNeeded){
            if(ingredient.ingredient.consumable)
            {
                let state : number = checkDisponibility(ingredient.ingredient._id, ingredient.quantity);
    
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

    export async function checkMealList() : Promise<any> {
        const allMeals : IMeal[] = await baseMeal.getAllMeals();
        await this.initPantryInventory();
    
        let mealState = [];
        for(let oneMeal of allMeals){
            const recipe : IRecipe = await baseRecipe.getRecipeByID(oneMeal.recipeID);
            const mealReady = await this.checkIfMealIsReady(oneMeal._id);
    
            mealState.push({
                title: recipe.title,
                state: mealReady
            });
        }
        return mealState;
    }
    
    export async function displayMealWithRecipeAndState() : Promise<any> {
        const allMeals : IMeal[] = await baseMeal.getAllMeals();
        await this.initPantryInventory();
    
        let mealData = [];
    
        for(let meal of allMeals){
            const recipeData : IRecipe = await baseRecipe.getRecipeByID(meal.recipeID);
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
    
    export async function getMealNumber() : Promise<number> {
        const allMeals : IMeal[] = await baseMeal.getAllMeals();
        return allMeals.length;
    }
}
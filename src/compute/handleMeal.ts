import { IRecipe } from "../models/recipe";
import { IMeal } from "../models/meal";

import { baseMeal } from "./base/meal";
import { baseRecipe } from "./base/recipe";

import { IPantryInventory, PantryInventory } from "./pantryInventory";
import { handleRecipe, IIngredientWithQuantity } from "./handleRecipe";

export interface IMealStatus {
    ingredientAvailable: IIngredientWithQuantity[],
    ingredientAlmostExpire: IIngredientWithQuantity[],
    ingredientUnavailable: IIngredientWithQuantity[]
}

export interface IMealPrettyStatus {
    title: string,
    state: IMealStatus
}

export interface IDisplayableMealStatus {
    _id: string,
    title: string,
    numberOfLunch: number,
    imagePath: string,
    state: IMealStatus
}

let g_pantryInventory : IPantryInventory[];

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function checkDisponibility(ingredientID : string, quantity : number) : number {
    const ingredientFound : IPantryInventory = g_pantryInventory.find((e : any) => e.ingredientID.toString() == ingredientID.toString());
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

export namespace handleMeal {

    export async function initPantryInventory() : Promise<void> {
        g_pantryInventory = await PantryInventory.getInventory();
    }

    export async function checkIfMealIsReady(mealID : string) : Promise<IMealStatus | void> {
        const meal : IMeal | void = await baseMeal.getMealByID(mealID);
        if(!meal) return;
        const ingredientsNeeded : IIngredientWithQuantity[] = await handleRecipe.getIngredientList(meal.recipeID, meal.numberOfLunchPlanned);
    
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

    export async function checkMealList() : Promise<IMealPrettyStatus[] | void> {
        const allMeals : IMeal[] | void = await baseMeal.getAllMeals(null, null);
        if(!allMeals) return ;
        await handleMeal.initPantryInventory();
    
        let mealState : IMealPrettyStatus[] = [];
        for(let oneMeal of allMeals){
            const recipe : IRecipe = await baseRecipe.getRecipeByID(oneMeal.recipeID);
            const mealReady : IMealStatus | void = await handleMeal.checkIfMealIsReady(oneMeal._id);
    
            if(!mealReady) continue;

            mealState.push({
                title: recipe.title,
                state: mealReady
            });
        }
        return mealState;
    }
    
    export async function displayMealWithRecipeAndState() : Promise<IDisplayableMealStatus[] | void> {
        const allMeals : IMeal[] | void = await baseMeal.getAllMeals(null, null);
        if(!allMeals) return;

        await handleMeal.initPantryInventory();

        let mealData : IDisplayableMealStatus[] = [];
    
        for(let meal of allMeals){
            const recipeData : IRecipe = await baseRecipe.getRecipeByID(meal.recipeID);
            const mealState : IMealStatus | void = await handleMeal.checkIfMealIsReady(meal._id);
            if(!mealState) continue;
    
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
    
    export async function getMealNumber() : Promise<number | void> {
        const allMeals : IMeal[] | void = await baseMeal.getAllMeals(null, null);
        if(!allMeals) return ;

        return allMeals.length;
    }
}
import { IRecipe } from "../models/recipe";
import { IInstruction } from "../models/instruction";
import { IIngredient } from "../models/ingredient";
import { baseInstruction } from "./base/instruction";
import { baseRecipe } from "./base/recipe";
import { baseIngredient } from "./base/ingredient";

const getIngredientIDFromInstruction = async function (instructionID : string) : Promise<any[]> {
    const instruction : IInstruction = await baseInstruction.getInstructionByID(instructionID);

    let ingredientsNeeded : any[] = [];
    instruction.ingredientsID.forEach((ingredient : any, index : number) => {
        ingredientsNeeded.push({
            ingredientID: ingredient,
            quantity: instruction.quantity[index]
        });
    });
    return ingredientsNeeded;
}

const concatList = function (originalList : any, additionList : any) : void {
    additionList.forEach((elementToAdd : any) => {
        let existingIngredient = originalList.find((e : any) => e.ingredient._id.toString() == elementToAdd.ingredient._id.toString());

        if (existingIngredient) existingIngredient.quantity += elementToAdd.quantity;
        else originalList.push(elementToAdd);
    })
}

const adaptQuantity = function (ingredientList : any, numberOfLunch : number, numberOfLunchRecipe : number) : void {
    ingredientList.forEach((ingredient : any) => {
        ingredient.quantity *= (numberOfLunch / numberOfLunchRecipe);
    });
}

const sortInstructions = function(x : any, y : any) : number {
    if (x.order < y.order) return -1;
    if (x.order > y.order) return 1;
    return 0;
}

export namespace handleRecipe {
    export async function getIngredientList(recipeID : string, numberOfLunch : number) {
        const instructions : IInstruction[] = await baseInstruction.getInstructionByRecipeID(recipeID);
        const recipe : IRecipe = await baseRecipe.getRecipeByID(recipeID);
    
        let ingredientsNeeded : any[] = [];
        for (let instruction of instructions) {
    
            let newIngredients : any[] = [];
            for (let i = 0; i < instruction.ingredientsID.length; i++) {
                const ingredient : IIngredient = await baseIngredient.getIngredientByID(instruction.ingredientsID[i]);
                newIngredients.push({
                    ingredient: ingredient,
                    quantity: instruction.quantity[i]
                });
            }
    
            adaptQuantity(newIngredients, numberOfLunch, recipe.numberOfLunch);
            concatList(ingredientsNeeded, newIngredients);
        }
        return ingredientsNeeded;
    }
    
    export async function getInstructionsByRecipeID(recipeID : string) : Promise<any[]> {
        let instructions : IInstruction[] = await baseInstruction.getInstructionByRecipeID(recipeID);
        instructions.sort(sortInstructions);
    
        let newInstruction = [];
        for (let instruction of instructions) {
            const ingredientsID : any[] = await getIngredientIDFromInstruction(instruction._id);
            const ingredients : IIngredient[] = await baseIngredient.getIngredientsByID(ingredientsID.map(e => e.ingredientID));
    
            let composition = [];
            for (let i = 0; i < ingredients.length; i++) {
                composition.push(
                    { 
                        name: ingredients[i].name,
                        imagePath: ingredients[i].imagePath,
                        quantity: instruction.quantity[i],
                        unitOfMeasure: ingredients[i].unitOfMeasure
                    });
            }
            
            newInstruction.push({
                _id: instruction._id,
                text: instruction.text,
                recipeID: instruction.recipeID,
                composition: composition,
                order: instruction.order,
                cookingTime: instruction.cookingTime
            });
        }
        return newInstruction;
    }
    
    export async function getPrettyRecipe(recipeID : string) : Promise<any> {
        let instructions : any[] = await this.getInstructionsByRecipeID(recipeID);
        let recipeData : IRecipe = await baseRecipe.getRecipeByID(recipeID);
        
        return {
            _id: recipeData._id,
            title: recipeData.title,
            numberOfLunch: recipeData.numberOfLunch,
            category: recipeData.category,
            duration: recipeData.duration,
            score: recipeData.score,
            instructions: instructions
        };
    }
}
import { IUpdateOne } from '../../models/mongoose';
import { IIngredient } from "../../models/ingredient";

const Ingredient = require("../../models/ingredient");

export namespace baseIngredient {
    
    export async function getIngredientNameByID(ingredientID : string) : Promise<string> {
        return Ingredient.findById(ingredientID).then((result : IIngredient) => {
            return result.name;
        });
    }
    
    export async function getIngredientByID(ingredientID : string) : Promise<IIngredient> {
        return Ingredient.findById(ingredientID);
    }
    
    export async function getIngredientsByID(ingredientsID : string) : Promise<IIngredient[]> {
        let ingredients : IIngredient[] = [];
    
        for (let ingredientID of ingredientsID) {
            const ingredient : IIngredient = await this.getIngredientByID(ingredientID);
            ingredients.push(ingredient);
        }
        return ingredients;
    }
    
    export async function getIngredientByName(ingredientName : string) : Promise<IIngredient> {
        return Ingredient.find({ name: ingredientName }).then((result : IIngredient[]) => {
            return result[0];
        });
    }
    
    export async function getAllIngredientsName() : Promise<string[]> {
        return Ingredient.find().then((results : IIngredient[]) => {
            return results.map((e : IIngredient) => e.name);
        })
    }
    
    export async function getIngredientsIDByName(ingredientsName : string) : Promise<string[]> {
        let ingredientsID : string[] = [];
    
        for (let ingredientName of ingredientsName) {
            const ingredient : IIngredient = await this.getIngredientByName(ingredientName);
            ingredientsID.push(ingredient._id);
        }
        return ingredientsID;
    }
    
    export async function getIngredientsNameFromIDs(ingredientIDs : string[]) : Promise<string[]> {
        let ingredientsName : string[] = [];
    
        for (let ingredientID of ingredientIDs) {
            const ingredientName : string = await this.getIngredientNameByID(ingredientID);
            ingredientsName.push(ingredientName);
        }
        return ingredientsName;
    }
    
    export async function getFilteredIngredient(name : string, pageSize : number, currentPage : number) : Promise<IIngredient[]> {
        let filters : any = {};
        if (name) filters.name = { "$regex": name, "$options": "i" };
        
        if (pageSize && currentPage > 0) {
            const query : Promise<IIngredient[]> = Ingredient.find(filters).limit(pageSize).skip(pageSize * (currentPage - 1));
            return query;
        }
        return Ingredient.find(filters);
    }
    
    export async function updateIngredient(_id : string, name : string, consumable : boolean, category : string, unitOfMeasure : string, shelfLife : number, freezable : boolean) : Promise<IUpdateOne> {
        let elementToUpdate : any = { _id: _id };
    
        if(name) elementToUpdate.name = name;
        if(consumable) elementToUpdate.consumable = consumable;
        if(category) elementToUpdate.category = category;
        if(unitOfMeasure) elementToUpdate.unitOfMeasure = unitOfMeasure;
        if(shelfLife) elementToUpdate.shelfLife = shelfLife;
        if(freezable) elementToUpdate.freezable = freezable;
    
        return Ingredient.updateOne({ _id: _id }, elementToUpdate);
    }
    
    export async function getAllIngredients() : Promise<IIngredient[]>{
        return Ingredient.find();
    }
}
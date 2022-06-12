import { IPantry } from "../models/pantry";
import { IIngredient } from "../models/ingredient";

import { baseIngredient } from "./base/ingredient";
import { basePantry } from "./base/pantry";

const getConsumableID = async function() : Promise<string[]> {
    let consumableIngredients : IIngredient[] = await baseIngredient.getConsumableIngredients();
    return consumableIngredients.map(e => e._id);
}

const getInventoryForIngredientID = async function(ingredientID : string) : Promise<any> {  
    let fetchedPantries : IPantry[] = await basePantry.getAllPantryByIngredientID(ingredientID);

    let sum = 0;
    let nearestExpirationDate : Date = new Date();
    nearestExpirationDate.setFullYear(nearestExpirationDate.getFullYear() + 1);

    fetchedPantries.forEach((e) => {
        sum += e.quantity;
        if(e.expirationDate < nearestExpirationDate) nearestExpirationDate = e.expirationDate;
    });
    return { quantityLeft: sum, nearestExpirationDate: nearestExpirationDate };
}

export namespace PantryInventory{

    export async function getInventory() : Promise<any[]> {
        const consumableIDs : string[] = await getConsumableID();
    
        let listAllConsumableLeft : any[] = [];
    
        for(let ingredientID of consumableIDs){
            const inventory : any = await getInventoryForIngredientID(ingredientID);
            listAllConsumableLeft.push({
                ingredientID: ingredientID,
                quantityLeft: inventory.quantityLeft,
                expirationDate: inventory.nearestExpirationDate
            });
        }
        return listAllConsumableLeft;
    }
    
    export async function getFullInventory() : Promise<any[]> {
        const allPantry : IPantry[] = await basePantry.getAllPantries(null, null);
    
        let prettyPantries : any[] = [];
    
        for(let pantry of allPantry){
            let ingredient : any = prettyPantries.find(e => e.ingredientID == pantry.ingredientID);
    
            if(ingredient){
                //Add pantry
                ingredient.pantries.push(pantry);
            }else{
                //Create element
                const ingredientInfo : IIngredient = await baseIngredient.getIngredientByID(pantry.ingredientID);
                prettyPantries.push({
                    ingredientID: pantry.ingredientID,
                    ingredientName: ingredientInfo.name,
                    ingredientImagePath: ingredientInfo.imagePath,
                    ingredientFreezable: ingredientInfo.freezable,
                    pantries: [pantry]
                })
            }
        }
        return prettyPantries;
    }
}
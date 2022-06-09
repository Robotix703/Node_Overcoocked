import { IIngredient } from "../models/ingredient";
import { baseIngredient } from "./base/ingredient";

exports.getConsumable = async function(ingredientID : string) : Promise<boolean> {
    let ingredient : IIngredient = await baseIngredient.getIngredientByID(ingredientID);
    return ingredient.consumable;
}
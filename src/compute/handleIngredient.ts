import { baseIngredient } from "./base/ingredient";

exports.getConsumable = async function(ingredientID : string){
    let ingredient = await baseIngredient.getIngredientByID(ingredientID);
    return ingredient.consumable;
}
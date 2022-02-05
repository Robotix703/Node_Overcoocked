const baseIngredient = require("./base/ingredient");

exports.getConsumable = async function(ingredientID){
    let ingredient = await baseIngredient.getIngredientByID(ingredientID);
    return ingredient.consumable;
}
const Ingredient = require("../../models/ingredient");

exports.getIngredientNameByID = async function(ingredientID){
    return Ingredient.findById(ingredientID).then((result) => {
        return result.name;
    })
}

exports.getIngredientByID = async function(ingredientID){
    return Ingredient.findById(ingredientID);
}
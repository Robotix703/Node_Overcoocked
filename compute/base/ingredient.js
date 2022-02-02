const Ingredient = require("../../models/ingredient");

exports.getIngredientNameByID = async function(ingredientID){
    return Ingredient.findById(ingredientID).then((result) => {
        return result.name;
    })
}

exports.getIngredientByID = async function(ingredientID){
    return Ingredient.findById(ingredientID);
}

exports.getIngredientByName = async function(ingredientName){
    return Ingredient.find({name: ingredientName}).then((result) => {
        return result[0];
    });
}

exports.getAllIngredientsName = async function(){
    return Ingredient.find().then((result) => {
        return result.map(e => e.name);
    })
}

exports.getIngredientsIDByName = async function(ingredientsName){
    let ingredientsID = [];

    for(ingredientName of ingredientsName){
        const ingredient = await this.getIngredientByName(ingredientName);
        ingredientsID.push(ingredient._id);
    }
    return ingredientsID;
}

exports.getIngredientsNameFromIDs = async function (ingredientIDs) {
    let ingredientsName = [];

    for (ingredientID of ingredientIDs) {
        const ingredientName = await this.getIngredientNameByID(ingredientID);
        ingredientsName.push(ingredientName);
    }
    return ingredientsName;
}
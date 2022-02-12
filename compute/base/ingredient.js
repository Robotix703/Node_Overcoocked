const Ingredient = require("../../models/ingredient");

exports.getIngredientNameByID = async function (ingredientID) {
    return Ingredient.findById(ingredientID).then((result) => {
        return result.name;
    })
}

exports.getIngredientByID = async function (ingredientID) {
    return Ingredient.findById(ingredientID);
}

exports.getIngredientsByID = async function (ingredientsID){
    let ingredients = [];

    for (ingredientID of ingredientsID) {
        const ingredient = await this.getIngredientByID(ingredientID);
        ingredients.push(ingredient);
    }
    return ingredients;
}

exports.getIngredientByName = async function (ingredientName) {
    return Ingredient.find({ name: ingredientName }).then((result) => {
        return result[0];
    });
}

exports.getAllIngredientsName = async function () {
    return Ingredient.find().then((result) => {
        return result.map(e => e.name);
    })
}

exports.getIngredientsIDByName = async function (ingredientsName) {
    let ingredientsID = [];

    for (ingredientName of ingredientsName) {
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

exports.getFilteredIngredient = async function (category) {
    let filters = {};
    if (category) filters.category = category;

    return Ingredient.find(filters);
}

exports.updateIngredient = async function(_id, name, consumable, category, unitOfMeasure, shelfLife, freezable){
    let elementToUpdate = { _id: _id };

    if(name) elementToUpdate.name = name;
    if(consumable) elementToUpdate.consumable = consumable;
    if(category) elementToUpdate.category = category;
    if(unitOfMeasure) elementToUpdate.unitOfMeasure = unitOfMeasure;
    if(shelfLife) elementToUpdate.shelfLife = shelfLife;
    if(freezable) elementToUpdate.freezable = freezable;

    return Ingredient.updateOne({ _id: _id }, elementToUpdate);
}

exports.getAllIngredients = async function(){
    return Ingredient.find();
}
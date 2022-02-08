const Recipe = require("../../models/recipe");

exports.getRecipeByID = async function(recipeID){
    return Recipe.findById(recipeID);
}

exports.updateLastCooked = async function(recipeID, lastCookedDate){
    let recipeToUpdate = await Recipe.findById(recipeID);
    recipeToUpdate.lastCooked = lastCookedDate.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
    return Recipe.updateOne({ _id: recipeID }, recipeToUpdate);
}

exports.filterRecipe = async function(category){
    let filters = {};
    if (category) filters.category = category;

    return Recipe.find(filters);
}

exports.searchByName = async function(name){
    return Recipe.find({ 'title': { "$regex": name, "$options": "i" } });
}
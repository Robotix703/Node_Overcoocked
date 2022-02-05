const Recipe = require("../../models/recipe");

exports.getRecipeByID = async function(recipeID){
    return Recipe.findById(recipeID);
}

exports.updateLastCooked = async function(recipeID, lastCookedDate){
    let recipeToUpdate = await Recipe.findById(recipeID);
    recipeToUpdate.lastCooked = lastCookedDate.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
    return Recipe.updateOne({ _id: recipeID }, recipeToUpdate);
}
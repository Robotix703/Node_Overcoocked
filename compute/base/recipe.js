const Recipe = require("../../models/recipe");

exports.getRecipeByID = async function(recipeID){
    return Recipe.findById(recipeID);
}
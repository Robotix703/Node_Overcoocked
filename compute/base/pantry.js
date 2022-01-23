const Pantry = require("../../models/pantry");

exports.getAllPantryByIngredientID = async function(ingredientID){
    return Pantry.find({ingredientID: ingredientID});
}

exports.deletePantryByID = async function(pantryID){
    return Pantry.deleteOne({ _id: pantryID });
}

exports.updatePantry = async function(pantry){    
    return Pantry.updateOne({ _id: pantry._id }, pantry)
}
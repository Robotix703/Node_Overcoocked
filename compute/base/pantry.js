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

exports.getAllPantries = async function(){
    return Pantry.find();
}

exports.getPantryByID = async function(pantryID){
    return Pantry.findById(pantryID);
}

exports.getAllPantryWithExpirationDate = async function(){
    return Pantry.find({expirationDate: {$exists: true}});
}

exports.updatePantry = async function(_id, ingredientID, quantity, expirationDate, frozen){
    let elementToUpdate = { _id: _id };

    if(ingredientID) elementToUpdate.ingredientID = ingredientID;
    if(quantity) elementToUpdate.quantity = quantity;
    if(expirationDate) elementToUpdate.expirationDate = expirationDate;
    if(frozen) elementToUpdate.frozen = frozen;

    return Pantry.updateOne({ _id: _id }, elementToUpdate);
}
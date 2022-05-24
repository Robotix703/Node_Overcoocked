const PantryForPantry = require("../../models/pantry");

exports.getAllPantryByIngredientID = async function(ingredientID : string){
    return Pantry.find({ingredientID: ingredientID});
}

exports.deletePantryByID = async function(pantryID : string){
    return Pantry.deleteOne({ _id: pantryID });
}

exports.updatePantry = async function(pantry : any){    
    return Pantry.updateOne({ _id: pantry._id }, pantry)
}

exports.getAllPantries = async function(){
    return Pantry.find();
}

exports.getPantryByID = async function(pantryID : string){
    return Pantry.findById(pantryID);
}

exports.getAllPantryWithExpirationDate = async function(){
    return Pantry.find({expirationDate: {$exists: true}});
}

exports.updatePantry = async function(_id : string, ingredientID : string, quantity : number, expirationDate : any, frozen : boolean){
    let elementToUpdate : any = { _id: _id };

    if(ingredientID) elementToUpdate.ingredientID = ingredientID;
    if(quantity) elementToUpdate.quantity = quantity;
    if(expirationDate) elementToUpdate.expirationDate = expirationDate;
    if(frozen) elementToUpdate.frozen = frozen;

    return Pantry.updateOne({ _id: _id }, elementToUpdate);
}
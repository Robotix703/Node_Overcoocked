import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import { pantry } from "../../models/pantry";

exports.getAllPantryByIngredientID = async function(ingredientID : string) : Promise<pantry> {
    return Pantry.find({ingredientID: ingredientID});
}

exports.deletePantryByID = async function(pantryID : string) : Promise<IDeleteOne> {
    return Pantry.deleteOne({ _id: pantryID });
}

exports.updatePantry = async function(pantry : pantry) : Promise<IUpdateOne> {    
    return Pantry.updateOne({ _id: pantry._id }, pantry);
}

exports.getAllPantries = async function() : Promise<pantry[]> {
    return Pantry.find();
}

exports.getPantryByID = async function(pantryID : string) : Promise<pantry> {
    return Pantry.findById(pantryID);
}

exports.getAllPantryWithExpirationDate = async function() : Promise<pantry[]> {
    return Pantry.find({expirationDate: {$exists: true}});
}

exports.updatePantry = async function(_id : string, ingredientID : string, quantity : number, expirationDate : string, frozen : boolean) : Promise<IUpdateOne> {
    let elementToUpdate : any = { _id: _id };

    if(ingredientID) elementToUpdate.ingredientID = ingredientID;
    if(quantity) elementToUpdate.quantity = quantity;
    if(expirationDate) elementToUpdate.expirationDate = expirationDate;
    if(frozen) elementToUpdate.frozen = frozen;

    return Pantry.updateOne({ _id: _id }, elementToUpdate);
}
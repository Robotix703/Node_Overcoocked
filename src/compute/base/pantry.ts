import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import Pantry, { IPantry } from "../../models/pantry";

export namespace basePantry {

    export async function getAllPantryByIngredientID(ingredientID : string) : Promise<IPantry> {
        return Pantry.find({ingredientID: ingredientID});
    }

    export async function deletePantryByID(pantryID : string) : Promise<IDeleteOne> {
        return Pantry.deleteOne({ _id: pantryID });
    }

    export async function updatePantryWithPantry(pantry : IPantry) : Promise<IUpdateOne> {    
        return Pantry.updateOne({ _id: pantry._id }, pantry);
    }

    export async function getAllPantries() : Promise<IPantry[]> {
        return Pantry.find();
    }

    export async function getPantryByID(pantryID : string) : Promise<IPantry> {
        return Pantry.findById(pantryID);
    }

    export async function getAllPantryWithExpirationDate() : Promise<IPantry[]> {
        return Pantry.find({expirationDate: {$exists: true}});
    }

    export async function updatePantry(_id : string, ingredientID : string, quantity : number, expirationDate : string, frozen : boolean) : Promise<IUpdateOne> {
        let elementToUpdate : any = { _id: _id };

        if(ingredientID) elementToUpdate.ingredientID = ingredientID;
        if(quantity) elementToUpdate.quantity = quantity;
        if(expirationDate) elementToUpdate.expirationDate = expirationDate;
        if(frozen) elementToUpdate.frozen = frozen;

        return Pantry.updateOne({ _id: _id }, elementToUpdate);
    }
}
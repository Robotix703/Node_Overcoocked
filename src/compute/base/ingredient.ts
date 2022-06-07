import { IUpdateOne } from '../../models/mongoose';
import { ingredient } from "../../models/ingredient";

const Ingredient = require("../../models/ingredient");

exports.getIngredientNameByID = async function (ingredientID : string) : Promise<string> {
    return Ingredient.findById(ingredientID).then((result : ingredient) => {
        return result.name;
    });
}

exports.getIngredientByID = async function (ingredientID : string) : Promise<ingredient> {
    return Ingredient.findById(ingredientID);
}

exports.getIngredientsByID = async function (ingredientsID : string) : Promise<ingredient[]> {
    let ingredients : ingredient[] = [];

    for (let ingredientID of ingredientsID) {
        const ingredient : ingredient = await this.getIngredientByID(ingredientID);
        ingredients.push(ingredient);
    }
    return ingredients;
}

exports.getIngredientByName = async function (ingredientName : string) : Promise<ingredient> {
    return Ingredient.find({ name: ingredientName }).then((result : ingredient[]) => {
        return result[0];
    });
}

exports.getAllIngredientsName = async function () : Promise<string[]> {
    return Ingredient.find().then((results : ingredient[]) => {
        return results.map((e : ingredient) => e.name);
    })
}

exports.getIngredientsIDByName = async function (ingredientsName : string) : Promise<string[]> {
    let ingredientsID : string[] = [];

    for (let ingredientName of ingredientsName) {
        const ingredient : ingredient = await this.getIngredientByName(ingredientName);
        ingredientsID.push(ingredient._id);
    }
    return ingredientsID;
}

exports.getIngredientsNameFromIDs = async function (ingredientIDs : string[]) : Promise<string[]> {
    let ingredientsName : string[] = [];

    for (let ingredientID of ingredientIDs) {
        const ingredientName : string = await this.getIngredientNameByID(ingredientID);
        ingredientsName.push(ingredientName);
    }
    return ingredientsName;
}

exports.getFilteredIngredient = async function (name : string, pageSize : number, currentPage : number) : Promise<ingredient[]> {
    let filters : any = {};
    if (name) filters.name = { "$regex": name, "$options": "i" };
    
    if (pageSize && currentPage > 0) {
        const query : Promise<ingredient[]> = Ingredient.find(filters).limit(pageSize).skip(pageSize * (currentPage - 1));
        return query;
    }
    return Ingredient.find(filters);
}

exports.updateIngredient = async function(_id : string, name : string, consumable : boolean, category : string, unitOfMeasure : string, shelfLife : number, freezable : boolean) : Promise<IUpdateOne> {
    let elementToUpdate : any = { _id: _id };

    if(name) elementToUpdate.name = name;
    if(consumable) elementToUpdate.consumable = consumable;
    if(category) elementToUpdate.category = category;
    if(unitOfMeasure) elementToUpdate.unitOfMeasure = unitOfMeasure;
    if(shelfLife) elementToUpdate.shelfLife = shelfLife;
    if(freezable) elementToUpdate.freezable = freezable;

    return Ingredient.updateOne({ _id: _id }, elementToUpdate);
}

exports.getAllIngredients = async function() : Promise<ingredient[]>{
    return Ingredient.find();
}
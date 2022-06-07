import { IUpdateOne } from "../../models/mongoose";
import { recipe } from "../../models/recipe";

const Recipe = require("../../models/recipe");

exports.getRecipeByID = async function (recipeID : string) : Promise<recipe> {
    return Recipe.findById(recipeID);
}

exports.updateLastCooked = async function (recipeID : string) : Promise<IUpdateOne> {
    let recipeToUpdate : recipe = await Recipe.findById(recipeID);
    recipeToUpdate.lastCooked = new Date;
    return Recipe.updateOne({ _id: recipeID }, recipeToUpdate);
}

exports.filterRecipe = async function (category : string, name : string, pageSize : number, currentPage : number) : Promise<recipe[]> {
    let filters : any = {};
    if (category) filters.category = category;
    if (name) filters.title = { "$regex": name, "$options": "i" };

    if (pageSize && currentPage > 0) {
        const query = Recipe.find(filters).limit(pageSize).skip(pageSize * (currentPage - 1));
        return query;
    }
    return Recipe.find(filters);
}

exports.searchByName = async function (name : string) : Promise<recipe[]> {
    return Recipe.find({ 'title': { "$regex": name, "$options": "i" } });
}

exports.updateRecipe = async function (_id : string, title : string, numberOfLunch : number, imagePath : string, category : string, duration : number, score : number, lastCooked : Date) : Promise<IUpdateOne> {
    let elementToUpdate : any = { _id: _id };

    if(title) elementToUpdate.title = title;
    if(numberOfLunch) elementToUpdate.numberOfLunch = numberOfLunch;
    if(imagePath) elementToUpdate.imagePath = imagePath;
    if(category) elementToUpdate.category = category;
    if(duration) elementToUpdate.duration = duration;
    if(score) elementToUpdate.score = score;
    if(lastCooked) elementToUpdate.lastCooked = lastCooked;

    return Recipe.updateOne({ _id: _id }, elementToUpdate);
}
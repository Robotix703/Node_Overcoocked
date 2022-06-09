import { IUpdateOne } from "../../models/mongoose";
import Recipe, { IRecipe } from "../../models/recipe";

export namespace baseRecipe {

    export async function getRecipeByID(recipeID : string) : Promise<IRecipe> {
        return Recipe.findById(recipeID);
    }

    export async function updateLastCooked(recipeID : string) : Promise<IUpdateOne> {
        let recipeToUpdate : IRecipe = await Recipe.findById(recipeID);
        recipeToUpdate.lastCooked = new Date;
        return Recipe.updateOne({ _id: recipeID }, recipeToUpdate);
    }

    export async function filterRecipe(category : string, name : string, pageSize : number, currentPage : number) : Promise<IRecipe[]> {
        let filters : any = {};
        if (category) filters.category = category;
        if (name) filters.title = { "$regex": name, "$options": "i" };

        if (pageSize && currentPage > 0) {
            const query = Recipe.find(filters).limit(pageSize).skip(pageSize * (currentPage - 1));
            return query;
        }
        return Recipe.find(filters);
    }

    export async function searchByName(name : string) : Promise<IRecipe[]> {
        return Recipe.find({ 'title': { "$regex": name, "$options": "i" } });
    }

    export async function updateRecipe(_id : string, title : string, numberOfLunch : number, imagePath : string, category : string, duration : number, score : number, lastCooked : Date) : Promise<IUpdateOne> {
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
}
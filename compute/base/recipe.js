const Recipe = require("../../models/recipe");

exports.getRecipeByID = async function (recipeID) {
    return Recipe.findById(recipeID);
}

exports.updateLastCooked = async function (recipeID) {
    let recipeToUpdate = await Recipe.findById(recipeID);
    recipeToUpdate.lastCooked = Date.now();
    return Recipe.updateOne({ _id: recipeID }, recipeToUpdate);
}

exports.filterRecipe = async function (category, name, pageSize, currentPage) {
    let filters = {};
    if (category) filters.category = category;
    if (name) filters.title = { "$regex": name, "$options": "i" };

    if (pageSize && currentPage > 0) {
        const query = Recipe.find(filters).limit(pageSize).skip(pageSize * (currentPage - 1));
        return query;
    }
    return Recipe.find(filters);
}

exports.searchByName = async function (name) {
    return Recipe.find({ 'title': { "$regex": name, "$options": "i" } });
}

exports.updateRecipe = async function (_id, title, numberOfLunch, imagePath, category, duration, score, lastCooked){
    let elementToUpdate = { _id: _id };

    if(title) elementToUpdate.title = title;
    if(numberOfLunch) elementToUpdate.numberOfLunch = numberOfLunch;
    if(imagePath) elementToUpdate.imagePath = imagePath;
    if(category) elementToUpdate.category = category;
    if(duration) elementToUpdate.duration = duration;
    if(score) elementToUpdate.score = score;
    if(lastCooked) elementToUpdate.lastCooked = lastCooked;

    return Recipe.updateOne({ _id: _id }, elementToUpdate);
}
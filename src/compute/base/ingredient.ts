const Ingredient = require("../../models/ingredient");

exports.getIngredientNameByID = async function (ingredientID : string) {
    return Ingredient.findById(ingredientID).then((result : any) => {
        return result.name;
    })
}

exports.getIngredientByID = async function (ingredientID : string) {
    return Ingredient.findById(ingredientID);
}

exports.getIngredientsByID = async function (ingredientsID : string){
    let ingredients = [];

    for (let ingredientID of ingredientsID) {
        const ingredient = await this.getIngredientByID(ingredientID);
        ingredients.push(ingredient);
    }
    return ingredients;
}

exports.getIngredientByName = async function (ingredientName : string) {
    return Ingredient.find({ name: ingredientName }).then((result : any) => {
        return result[0];
    });
}

exports.getAllIngredientsName = async function () {
    return Ingredient.find().then((result : any) => {
        return result.map((e : any) => e.name);
    })
}

exports.getIngredientsIDByName = async function (ingredientsName : string) {
    let ingredientsID = [];

    for (let ingredientName of ingredientsName) {
        const ingredient = await this.getIngredientByName(ingredientName);
        ingredientsID.push(ingredient._id);
    }
    return ingredientsID;
}

exports.getIngredientsNameFromIDs = async function (ingredientIDs : string[]) {
    let ingredientsName = [];

    for (let ingredientID of ingredientIDs) {
        const ingredientName = await this.getIngredientNameByID(ingredientID);
        ingredientsName.push(ingredientName);
    }
    return ingredientsName;
}

exports.getFilteredIngredient = async function (name : string, pageSize : number, currentPage : number) {
    let filters : any = {};
    if (name) filters.name = { "$regex": name, "$options": "i" };
    
    if (pageSize && currentPage > 0) {
        const query = Ingredient.find(filters).limit(pageSize).skip(pageSize * (currentPage - 1));
        return query;
    }
    return Ingredient.find(filters);
}

exports.updateIngredient = async function(_id : string, name : string, consumable : boolean, category : string, unitOfMeasure : string, shelfLife : boolean, freezable : boolean){
    let elementToUpdate : any = { _id: _id };

    if(name) elementToUpdate.name = name;
    if(consumable) elementToUpdate.consumable = consumable;
    if(category) elementToUpdate.category = category;
    if(unitOfMeasure) elementToUpdate.unitOfMeasure = unitOfMeasure;
    if(shelfLife) elementToUpdate.shelfLife = shelfLife;
    if(freezable) elementToUpdate.freezable = freezable;

    return Ingredient.updateOne({ _id: _id }, elementToUpdate);
}

exports.getAllIngredients = async function(){
    return Ingredient.find();
}
const ingredient = require("../models/ingredient");

getIngredientIDByName = async function(ingredientName){
    return ingredient.find({name: ingredientName})
        .then(documents => {
            if(!documents[0]) return "";
            return documents[0]._id;
        })
        .catch(error => {
            console.error(error);
            return "";
        });
}

exports.getIngredientsIDByName = async function(ingredientsName){

    let ingredientsID = [];

    for(ingredientName of ingredientsName){
        let ingredient = await getIngredientIDByName(ingredientName);
        ingredientsID.push(ingredient);
    }

    return ingredientsID;
}
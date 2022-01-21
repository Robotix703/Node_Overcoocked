require('dotenv').config();
const Todoist = require("../modules/Todoist/main");

function formatIngredient(ingredient){
    return ingredient.ingredientName + " - " + ingredient.quantity;
}

exports.registerIngredient = function(ingredientList){
    ingredientList.forEach((ingredient) => {
        Todoist.addItemsInProjectByName(process.env.TODOPROJECT, formatIngredient(ingredient));
    })
}
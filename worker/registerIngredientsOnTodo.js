require('dotenv').config();
const Todoist = require("../modules/Todoist/main");
const TodoItem = require("../models/todoItem");

function formatIngredient(ingredient){
    return ingredient.ingredientName + " - " + ingredient.quantity;
}

async function registerItem(itemID, itemText){
    const todoItem = new TodoItem({
        todoID: itemID,
        text: itemText
      });
    
      todoItem.save()
        .then(result => {
          return true;
        })
        .catch(error => {
          console.error(error);
          return false;
        });
}

exports.registerIngredient = async function(ingredientList){
    for(ingredient of ingredientList){
        let ingredientText = formatIngredient(ingredient);
        let todoItem = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText);
        await registerItem(todoItem.id, ingredientText);
    }
}
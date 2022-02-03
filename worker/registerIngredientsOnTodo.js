require('dotenv').config();
const Todoist = require("../modules/Todoist/main");
const TodoItem = require("../models/todoItem");

function formatIngredient(ingredient) {
  return ingredient.ingredient.name + " - " + ingredient.quantity + " " + ingredient.ingredient.unitOfMeasure;
}

async function registerItem(itemID, itemText, name) {
  const todoItem = new TodoItem({
    todoID: itemID,
    text: itemText,
    ingredientName: name
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

exports.registerIngredient = async function (ingredientList) {
  for (ingredient of ingredientList) {
    const ingredientText = formatIngredient(ingredient);
    const todoItem = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText);
    await registerItem(todoItem.id, ingredientText, ingredient.ingredient.name);
  }
}
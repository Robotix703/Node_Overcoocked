require('dotenv').config();
const Todoist = require("../modules/Todoist/main");

const handleTodoItem = require("../compute/handleTodoItem");
const handleIngredient = require("../compute/handleIngredient");

function formatIngredient(ingredient) {
  return ingredient.ingredient.name + " - " + ingredient.quantity + " " + ingredient.ingredient.unitOfMeasure;
}

async function updateTodoItem(existingIngredient, newIngredient, consumable){
  const textSplit = existingIngredient[0].text.split(" - ");
  const quantity = textSplit[1].split(" ")[0];

  newIngredient.quantity += parseInt(quantity);
  const ingredientText = formatIngredient(ingredient);

  await Todoist.updateItemInProjectByName(process.env.TODOPROJECT, existingIngredient[0].todoID, ingredientText);
  if(consumable) await handleTodoItem.updateTodoItem(existingIngredient[0]._id, existingIngredient[0].todoID, ingredientText, newIngredient.ingredient.name);
}

async function addTodoItem(ingredient, consumable){
  const ingredientText = formatIngredient(ingredient);
  const todoItem = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText);
  if(consumable) await handleTodoItem.registerTodoItem(todoItem.id, ingredientText, ingredient.ingredient.name);
}

exports.registerIngredient = async function (ingredientList) {
  for (ingredient of ingredientList) {
    let existingIngredient = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredient.ingredient.name);
    let consumable = await handleIngredient.getConsumable(ingredient.ingredient._id);

    if(existingIngredient.length > 0){
      await updateTodoItem(existingIngredient, ingredient, consumable);
    }else{
      await addTodoItem(ingredient, consumable);
    }
  }
}
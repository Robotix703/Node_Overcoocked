require('dotenv').config();
const Todoist = require("../modules/Todoist/main");
const TodoItem = require("../models/todoItem");
const handleTodoItem = require("../compute/handleTodoItem")

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

async function updateTodoItem(existingIngredient, newIngredient){
  const textSplit = existingIngredient[0].text.split(" - ");
  const quantity = textSplit[1].split(" ")[0];

  newIngredient.quantity += parseInt(quantity);
  const ingredientText = formatIngredient(ingredient);

  await Todoist.updateItemInProjectByName(process.env.TODOPROJECT, existingIngredient[0].todoID, ingredientText);
  await handleTodoItem.updateTodoItem(existingIngredient[0]._id, existingIngredient[0].todoID, ingredientText, newIngredient.ingredient.name);
}

async function addTodoItem(ingredient){
  const ingredientText = formatIngredient(ingredient);
  const todoItem = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText);
  await registerItem(todoItem.id, ingredientText, ingredient.ingredient.name);
}

exports.registerIngredient = async function (ingredientList) {
  for (ingredient of ingredientList) {
    let existingIngredient = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredient.ingredient.name);

    if(existingIngredient){
      await updateTodoItem(existingIngredient, ingredient);
    }else{
      await addTodoItem(ingredient);
    }
  }
}
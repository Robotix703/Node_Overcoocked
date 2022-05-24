require('dotenv').config();
const Todoist = require("../modules/Todoist/main");

const handleTodoItem = require("../compute/handleTodoItem");
const handleIngredient = require("../compute/handleIngredient");

function formatIngredient(ingredientName : string, ingredientUnitOfMeasure : string, ingredientQuantity : number) {
  return ingredientName + " - " + ingredientQuantity + " " + ingredientUnitOfMeasure;
}

async function updateTodoItem(existingIngredient : any, newIngredient : any){
  const textSplit = existingIngredient[0].text.split(" - ");
  const quantity = textSplit[1].split(" ")[0];

  newIngredient.quantity += parseInt(quantity);
  const ingredientText = formatIngredient(newIngredient.ingredient.name, newIngredient.ingredient.unitOfMeasure, newIngredient.quantity);

  await Todoist.updateItemInProjectByName(process.env.TODOPROJECT, existingIngredient[0].todoID, ingredientText);
  await handleTodoItem.updateTodoItem(existingIngredient[0]._id, existingIngredient[0].todoID, ingredientText, newIngredient.ingredient.name);
}

async function addTodoItem(ingredient : any, consumable : boolean){
  const ingredientText = formatIngredient(ingredient.ingredient.name, ingredient.ingredient.unitOfMeasure, ingredient.quantity);
  const todoItem = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText);
  await handleTodoItem.registerTodoItem(todoItem.id, ingredientText, ingredient.ingredient.name, consumable);
}

exports.registerIngredients = async function (ingredientList : any) {
  for (let ingredient of ingredientList) {
    let existingIngredient = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredient.ingredient.name);
    let consumable = await handleIngredient.getConsumable(ingredient.ingredient._id);

    if(existingIngredient.length > 0){
      await updateTodoItem(existingIngredient, ingredient);
    }else{
      await addTodoItem(ingredient, consumable);
    }
  }
}

exports.registerIngredient = async function(ingredientID : string, ingredientName : string, quantity : number, ingredientUnitOfMeasure : string){
  let existingIngredient = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredientName);
  let consumable = await handleIngredient.getConsumable(ingredientID);

  if(existingIngredient.length > 0){
    await updateTodoItem(existingIngredient, {ingredient: {name: ingredientName, unitOfMeasure: ingredientUnitOfMeasure}, quantity: quantity});
  }else{
    await addTodoItem({ingredient: {name: ingredientName, unitOfMeasure: ingredientUnitOfMeasure}, quantity: quantity}, consumable);
  }
}
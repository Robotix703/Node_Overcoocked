require('dotenv').config();
import { Todoist } from "../modules/todoist";

import { baseTodoItem } from "../compute/base/todoItem";
import { baseIngredient } from "../compute/base/ingredient";
import { handleTodoItem } from "../compute/handleTodoItem";
import { handleIngredient } from "../compute/handleIngredient";

import { ITodoItem } from "../models/todoItem";
import { IIngredient } from "../models/ingredient";
import { IIngredientWithQuantity } from "../compute/handleRecipe";

import { Task } from "@doist/todoist-api-typescript";

export function formatIngredient(ingredientName : string, ingredientUnitOfMeasure : string, ingredientQuantity : number) : string {
  return ingredientName + " - " + ingredientQuantity + " " + ingredientUnitOfMeasure;
}

export async function updateTodoItem(existingIngredient : ITodoItem[], newIngredient : IIngredientWithQuantity) : Promise<void> {
  const textSplit : string[] = existingIngredient[0].text.split(" - ");
  const quantity : string = textSplit[1].split(" ")[0];

  newIngredient.quantity += parseInt(quantity);
  const ingredientText : string = formatIngredient(newIngredient.ingredient.name, newIngredient.ingredient.unitOfMeasure, newIngredient.quantity);

  await Todoist.updateItem(existingIngredient[0].todoID, ingredientText);
  await baseTodoItem.updateTodoItem(existingIngredient[0]._id, existingIngredient[0].todoID, ingredientText, newIngredient.ingredient.name, existingIngredient[0].consumable);
}

export async function addTodoItem(ingredient : IIngredientWithQuantity, consumable : boolean) : Promise<any> {
  const ingredientText : string = formatIngredient(ingredient.ingredient.name, ingredient.ingredient.unitOfMeasure, ingredient.quantity);
  const todoItem : Task = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText);
  await baseTodoItem.registerTodoItem(todoItem.id.toString(), ingredientText, ingredient.ingredient.name, consumable);
}

export namespace registerIngredientsOnTodo {
  
  export async function registerIngredients(ingredientList : IIngredientWithQuantity[]) : Promise<void> {
    for (let ingredient of ingredientList) {
      let existingIngredient : ITodoItem[] = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredient.ingredient.name);
      let consumable : boolean = await handleIngredient.getConsumable(ingredient.ingredient._id);
  
      if(existingIngredient.length > 0){
        await updateTodoItem(existingIngredient, ingredient);
      }else{
        await addTodoItem(ingredient, consumable);
      }
    }
  }
  
  export async function registerIngredient(ingredientID : string, ingredientName : string, quantity : number) : Promise<void> {
    let existingIngredient : ITodoItem[] = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredientName);
    let consumable : boolean = await handleIngredient.getConsumable(ingredientID);
    let ingredient : IIngredient = await baseIngredient.getIngredientByName(ingredientName);
  
    if(existingIngredient.length > 0){
      await updateTodoItem(existingIngredient, { ingredient: ingredient, quantity: quantity });
    }else{
      await addTodoItem({ ingredient: ingredient, quantity: quantity }, consumable);
    }
  }
}
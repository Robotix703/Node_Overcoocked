require('dotenv').config();
import { ITodoItem } from "../models/todoItem";
import { IIngredient } from "../models/ingredient";

import { baseIngredient } from "../compute/base/ingredient";
import { basePantry } from "../compute/base/pantry";
import { baseTodoItem } from "../compute/base/todoItem";

import { Todoist } from "../modules/todoist";
import { Task } from "@doist/todoist-api-typescript";

export function addDays(date: Date, days: number): Date {
    let newdate = new Date(date);
    newdate.setDate(date.getDate() + days);
    return newdate;
}

export async function addIngredientToPantry (itemText: string): Promise<void> {
    const textSplit : string[] = itemText.split(" - ");
    const ingredientName : string = textSplit[0];
    const quantity : string = textSplit[1].split(" ")[0];

    const ingredient : IIngredient = await baseIngredient.getIngredientByName(ingredientName);
    
    let expirationDate: Date = new Date();
    if(ingredient.shelfLife){
        expirationDate = addDays(expirationDate, ingredient.shelfLife);
    }

    await basePantry.register(
        ingredient._id, 
        parseInt(quantity), 
        expirationDate || null, 
        false
    );
}

export async function checkDeleteItem(todoItems : Task[], mongoItems : ITodoItem[]) : Promise<void> {
    for (let item of mongoItems) {
        const itemFound : boolean = (todoItems.find((e : Task) => e.id == item.todoID) != undefined);

        if (!itemFound) {
            //Add to pantry
            if(item.consumable) await addIngredientToPantry(item.text);

            //Remove item from Mongo
            await baseTodoItem.deleteTodoItem(item.todoID.toString());
        }
    }
}

export default async function checkTodoList() : Promise<void> {
    const todoItems : Task[] = await Todoist.getItemsInProjectByName(process.env.TODOPROJECT);
    const mongoItems : ITodoItem[] = await baseTodoItem.readTodoItems();

    await checkDeleteItem(todoItems, mongoItems);
}
require('dotenv').config();
import { ITodoItem } from "../models/todoItem";
import { IIngredient } from "../models/ingredient";
import { IDeleteOne } from "../models/mongoose";

import { baseIngredient } from "../compute/base/ingredient";
import { basePantry } from "../compute/base/pantry";
import { baseTodoItem } from "../compute/base/todoItem";

import { Todoist } from "../modules/todoist";

function addDays(date: Date, days: number): Date {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function addIngredientToPantry (itemText: string): Promise<void> {
    const textSplit : string[] = itemText.split(" - ");
    const ingredientName : string = textSplit[0];
    const quantity : string = textSplit[1].split(" ")[0];

    const ingredient : IIngredient = await baseIngredient.getIngredientByName(ingredientName);
    
    let expirationDate: Date = new Date();
    if(ingredient.shelfLife){
        expirationDate = addDays(expirationDate, ingredient.shelfLife);
    }

    await basePantry.register(ingredient._id, parseInt(quantity), expirationDate || null, false);
}

async function removeItemFromMongo(todoID: string) : Promise<IDeleteOne> {
    return baseTodoItem.deleteTodoItem(todoID);
}

async function getItemOnMongo(): Promise<ITodoItem[]> {
    return baseTodoItem.readTodoItems();
}

async function checkDeleteItem(todoItems : any, mongoItems : any) : Promise<void> {
    for (let item of mongoItems) {
        const itemFound : boolean = (todoItems.find((e : any) => e.id == item.todoID) != undefined);

        if (!itemFound) {
            //Add to pantry
            if(item.consumable) await addIngredientToPantry(item.text);

            //Remove item from Mongo
            await removeItemFromMongo(item.todoID);
        }
    }
}

export default async function checkTodoList() : Promise<void> {
    const todoItems : any = await Todoist.getItemsInProjectByName(process.env.TODOPROJECT);
    const mongoItems : ITodoItem[] = await getItemOnMongo();

    await checkDeleteItem(todoItems, mongoItems);
}
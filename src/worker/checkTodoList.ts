require('dotenv').config();
import { ITodoItem } from "../models/todoItem";
import { getItemsInProjectByName } from "../modules/todoist";
import Pantry from "../models/pantry";
import TodoItem from "../models/todoItem";
import { baseIngredient } from "../compute/base/ingredient";

function addDays(date: Date, days: number): Date {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function addIngredientToPantry (itemText: string): Promise<void> {
    const textSplit = itemText.split(" - ");
    const ingredientName = textSplit[0];
    const quantity = textSplit[1].split(" ")[0];

    const ingredient = await baseIngredient.getIngredientByName(ingredientName);
    
    let expirationDate: any = new Date();
    if(ingredient.shelfLife){
        expirationDate = addDays(expirationDate, ingredient.shelfLife);
    }

    const pantry = new Pantry({
        ingredientID: ingredient._id,
        quantity: quantity,
        expirationDate: expirationDate || null
    });

    await pantry.save();
}

async function removeItemFromMongo(todoID: string) {
    return TodoItem.deleteOne({ todoID: todoID });
}

async function getItemOnMongo(): Promise<ITodoItem> {
    return TodoItem.find();
}

async function checkDeleteItem(todoItems : any, mongoItems : any) {
    for (let item of mongoItems) {
        const itemFound = (todoItems.find((e : any) => e.id == item.todoID) != undefined);

        if (!itemFound) {
            //Add to pantry
            if(item.consumable) await addIngredientToPantry(item.text);

            //Remove item from Mongo
            await removeItemFromMongo(item.todoID);
        }
    }
}

exports.checkTodoList = async function () {
    const todoItems = await getItemsInProjectByName(process.env.TODOPROJECT);
    const mongoItems = await getItemOnMongo();

    await checkDeleteItem(todoItems, mongoItems);
}
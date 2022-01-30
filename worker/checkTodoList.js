require('dotenv').config();
const Todoist = require("../modules/Todoist/main");

const baseIngredient = require("../compute/base/ingredient");

const TodoItem = require("../models/todoItem");
const Pantry = require("../models/pantry");

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function addIngredientToPantry (itemText) {
    const textSplit = itemText.split(" - ");
    const ingredientName = textSplit[0];
    const quantity = textSplit[1].split(" ")[0];

    const ingredient = await baseIngredient.getIngredientByName(ingredientName);
    
    let expirationDate = new Date();
    if(ingredient.shelfLife != -1){
        expirationDate = expirationDate.addDays(ingredient.shelfLife);
    }

    const pantry = new Pantry({
        ingredientID: ingredient._id,
        quantity: quantity,
        expirationDate: expirationDate || null
    });

    return pantry.save();
}

async function removeItemFromMongo(todoID) {
    return TodoItem.deleteOne({ todoID: todoID });
}

async function getItemOnMongo() {
    return TodoItem.find();
}

async function checkDeleteItem(todoItems, mongoItems) {
    for (item of mongoItems) {
        const itemFound = (todoItems.find(e => e.id == item.todoID) != undefined);

        if (!itemFound) {
            //Add to pantry
            await addIngredientToPantry(item.text);

            //Remove item from Mongo
            await removeItemFromMongo(item.todoID);
        }
    }
}

exports.checkTodoList = async function () {
    const todoItems = await Todoist.getItemsInProjectByName(process.env.TODOPROJECT);
    const mongoItems = await getItemOnMongo();

    await checkDeleteItem(todoItems, mongoItems);
}
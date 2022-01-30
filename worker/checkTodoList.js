require('dotenv').config();
const Todoist = require("../modules/Todoist/main");

const baseIngredient = require("../compute/base/ingredient");

const TodoItem = require("../models/todoItem");
const Pantry = require("../models/pantry");

async function addIngredientToPantry (itemText) {
    const textSplit = itemText.split(" - ");
    const ingredientName = textSplit[0];
    const quantity = textSplit[1];

    const ingredientID = await baseIngredient.getIngredientByName(ingredientName);

    const pantry = new Pantry({
        ingredientID: ingredientID,
        quantity: quantity
    })

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
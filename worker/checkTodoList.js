require('dotenv').config();
const Todoist = require("../modules/Todoist/main");
const getIngredientsIDByName = require("../compute/getIngredientsIDByName");

const TodoItem = require("../models/todoItem");
const Pantry = require("../models/pantry");

async function addIngredientToPantry (itemText) {
    let textSplit = itemText.split(" - ");
    const ingredientName = textSplit[0];
    const quantity = textSplit[1];

    let ingredientID = await (await getIngredientsIDByName.getIngredientsIDByName([ingredientName]))[0];

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
        let itemFound = (todoItems.find(e => e.id == item.todoID) != undefined);

        if (!itemFound) {
            console.log(item.todoID);
            //Add to pantry
            await addIngredientToPantry(item.text);

            //Remove item from Mongo
            await removeItemFromMongo(item.todoID);
        }
    }
}

exports.checkTodoList = async function () {
    let todoItems = await Todoist.getItemsInProjectByName(process.env.TODOPROJECT);
    let mongoItems = await getItemOnMongo();

    await checkDeleteItem(todoItems, mongoItems);
}
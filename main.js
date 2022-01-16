const BDD = require('./BDD');

const SMS = require("./modules/sms/sms");
const Todoist = require("./modules/Todoist/main");
const pantryInventory = require("./compute/pantryInventory");
const recipeIngredientsNeeded = require("./compute/recipeIngredientsNeeded");
const getIngredientsIDByName = require("./compute/getIngredientsIDByName");

//let tel = process.env.INDFR + process.env.TEL;
//SMS.SendSMS([tel], "Hello World !!");

/*
Todoist.getItemsInProjectByName(process.env.TODOPROJECT).then((items) => {
    console.log(items);
});

Todoist.addItemsInProjectByName(process.env.TODOPROJECT, "Hello World !").then(() => {
    
})
*/

setTimeout(() => {
    getIngredientsIDByName.getIngredientsIDByName(["Premier", "Deuxième"]).then((list) => {
        console.log(list);
    })
}, 1000)
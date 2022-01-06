const BDD = require('./BDD');

const SMS = require("./modules/sms/sms");
const Todoist = require("./modules/Todoist/main");
const pantryInventory = require("./compute/pantryInventory");
const recipeIngredientsNeeded = require("./compute/recipeIngredientsNeeded");

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
    recipeIngredientsNeeded.getIngredientList("61d224001d34e83ec8c45463").then((list) => {
        console.log(list);
    })
}, 1000)
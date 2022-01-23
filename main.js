const BDD = require('./BDD');

const SMS = require("./modules/sms/sms");
const Todoist = require("./modules/Todoist/main");
const Scheduler = require("./modules/scheduler/main");

const pantryInventory = require("./compute/pantryInventory");
const recipeIngredientsNeeded = require("./compute/recipeIngredientsNeeded");
const getIngredientsIDByName = require("./compute/getIngredientsIDByName");
const checkTodoList = require("./worker/checkTodoList");
const checkIfMealIsReady = require("./compute/checkIfMealIsReady");
const updatePantry = require("./compute/updatePantryWhenMealIsDone");
const tasksHandler = require("./worker/handleScheduleTask");
const init = require("./initialization");
const sendSMS = require("./worker/sendSMSToEverybody");

//let tel = process.env.INDFR + process.env.TEL;
//SMS.SendSMS([tel], "Hello World !!");

/*
Todoist.getItemsInProjectByName(process.env.TODOPROJECT).then((items) => {
    console.log(items);
});

Todoist.addItemsInProjectByName(process.env.TODOPROJECT, "Hello World !").then(() => {
    
})

setTimeout(() => {
    recipeIngredientsNeeded.getIngredientsName(["61e4824d37e79bdd03e851c5"]).then((list) => {
        console.log(list);
    })
}, 1000)

setTimeout(async () => {
    //checkTodoList.checkTodoList();
    await checkTodoList.addIngredientToPantry("Pates - 400");
}, 1000)

setTimeout(async () => {
    let ready = await checkIfMealIsReady.checkIfMealIsReady("61ed217e106492788fc5b105");
    console.log(ready);
}, 1000)

setTimeout(async () => {
    await updatePantry.updatePantryWhenMealsIsDone("61ed217e106492788fc5b105", 100);
}, 1000)

tasksHandler.addperiodicTask(
    function(){console.log("COUCOU")},
    "10 * * * * *",
    "COUCOU"
)
tasksHandler.triggerTask("COUCOU");
tasksHandler.stopTask("COUCOU");

setTimeout(async () => {
    init.init();
}, 1000)
*/

setTimeout(async () => {
    let state = await checkIfMealIsReady.checkMealList();
    console.log(state);
}, 1000)

const BDD = require('./BDD');
BDD.connectToDataBase()
.then(() => {
    console.log("BDD - Connectée");
})
.catch((error) => {
    console.log("BDD - Erreur de connexion");
    console.error(error);
});

/*
const Todoist = require("./modules/Todoist/main");

Todoist.deleteItemInProjectByName(process.env.TODOPROJECT, "5559538308");
*/

/*
const handleMeal = require("./compute/handleMeal");

setTimeout(async () => {
    let result = await handleMeal.checkMealList();
    console.log("Available", result[0].ingredientAvailable);
    console.log("AlmostExpire", result[0].state.ingredientAlmostExpire);
    console.log("Unavailable", result[0].state.ingredientUnavailable);
}, 1000)
*/

const dailyCheck = require("./worker/dailyCheck");

setTimeout(async () => {
    await dailyCheck.dailyCheck();
}, 1000)
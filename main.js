const BDD = require('./BDD');
BDD.connectToDataBase()
.then(() => {
    console.log("BDD - Connectée");
})
.catch((error) => {
    console.log("BDD - Erreur de connexion");
    console.error(error);
});

const Todoist = require("./modules/Todoist/main");

Todoist.deleteItemInProjectByName(process.env.TODOPROJECT, "5559538308");

/*
const baseRecipe = require("./compute/base/recipe.js");

setTimeout(async () => {
    let result = await baseRecipe.updateLastCooked("61f2f959c79e3c830e6d3a56", "2022-01-29T16:58:42.000Z");
    console.log(result);
}, 1000)
*/
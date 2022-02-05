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

const handlePantry = require("./compute/handlePantry");

setTimeout(async () => {
    let result = await handlePantry.checkPantryExpiration();
    console.log(result);
}, 1000)

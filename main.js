const BDD = require('./BDD');
BDD.connectToDataBase()
.then(() => {
    console.log("BDD - Connectée");
})
.catch((error) => {
    console.log("BDD - Erreur de connexion");
    console.error(error);
});

const pantryInventory = require("./compute/pantryInventory.js");

setTimeout(async () => {
    let result = await pantryInventory.getFullInventory();
    console.log(result);
    for(element of result){
        console.log(element.ingredientName);
        console.log(element.pantries);
    }
}, 1000)
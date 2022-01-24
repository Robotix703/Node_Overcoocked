const BDD = require('./BDD');
BDD.connectToDataBase()
.then(() => {
    console.log("BDD - Connectée");
})
.catch((error) => {
    console.log("BDD - Erreur de connexion");
    console.error(error);
});

const displayMeal = require("./compute/displayMeals");

setTimeout(async () => {
    let result = await displayMeal.displayMealWithRecipeAndState();
    console.log(result);
}, 1000)
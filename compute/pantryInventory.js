const Ingredient = require('../models/ingredient');
const Pantry = require('../models/pantry');

getConsumableID = async function(){
    let ingredientQuery = Ingredient.find({consumable: true});
    let fetchedingredients;

    return ingredientQuery
        .then(documents => {
            fetchedingredients = [...documents];
            return fetchedingredients.map(e => e._id);
        })
        .catch(error => {
            console.error("getConsumableID error : ", error);
            return;
        });
}

getInventoryForIngredientID = async function(ingredientID){
    let pantryQuery = Pantry.find({ingredientID: ingredientID});
    let fetchedPantries;
  
    return pantryQuery
        .then(documents => {
            fetchedPantries = [...documents];

            let sum = 0;
            let nearestExpirationDate = new Date();
            nearestExpirationDate.setFullYear(nearestExpirationDate.getFullYear() + 1);

            fetchedPantries.forEach((e) => {
                sum += e.quantity;
                if(e.expirationDate < nearestExpirationDate) nearestExpirationDate = e.expirationDate;
            })
            return {quantityLeft: sum, nearestExpirationDate: nearestExpirationDate};
        })
        .catch(error => {
            console.error(error);
            return;
        });
}

exports.getInventory = async function(){
    let consumableIDs = await getConsumableID();

    let listAllConsumableLeft = [];
    for(const ingredientID of consumableIDs){
        let inventory = await getInventoryForIngredientID(ingredientID);
        listAllConsumableLeft.push({
            ingredientID: ingredientID,
            quantityLeft: inventory.quantityLeft,
            expirationDate: inventory.nearestExpirationDate
        })
    }

    return listAllConsumableLeft;
}
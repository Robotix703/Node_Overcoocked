const Ingredient = require('../models/ingredient');
const Pantry = require('../models/pantry');

const basePantry = require("./base/pantry");
const baseIngredient = require("./base/ingredient");

getConsumableID = async function(){
    return Ingredient.find({consumable: true})
        .then(documents => {
            const fetchedingredients = [...documents];
            return fetchedingredients.map(e => e._id);
        })
        .catch(error => {
            console.error("getConsumableID error : ", error);
            return;
        });
}

getInventoryForIngredientID = async function(ingredientID){  
    return Pantry.find({ingredientID: ingredientID})
        .then(documents => {
            const fetchedPantries = [...documents];

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
    const consumableIDs = await getConsumableID();

    let listAllConsumableLeft = [];

    for(ingredientID of consumableIDs){
        const inventory = await getInventoryForIngredientID(ingredientID);
        listAllConsumableLeft.push({
            ingredientID: ingredientID,
            quantityLeft: inventory.quantityLeft,
            expirationDate: inventory.nearestExpirationDate
        });
    }
    return listAllConsumableLeft;
}

exports.getFullInventory = async function(){
    const allPantry = await basePantry.getAllPantries();

    let prettyPantries = [];

    for(pantry of allPantry){
        let ingredient = prettyPantries.find(e => e.ingredientID == pantry.ingredientID);

        if(ingredient){
            //Add pantry
            ingredient.pantries.push(pantry);
        }else{
            //Create element
            const ingredientInfo = await baseIngredient.getIngredientByID(pantry.ingredientID);
            prettyPantries.push({
                ingredientID: pantry.ingredientID,
                ingredientName: ingredientInfo.name,
                ingredientImagePath: ingredientInfo.imagePath,
                ingredientFreezable: ingredientInfo.freezable,
                pantries: [pantry]
            })
        }
    }
    return prettyPantries;
}
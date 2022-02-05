const checkIfMealIsReady = require("../compute/handleMeal");
const handlePantry = require("../compute/handlePantry");

const smsSender = require("./sendSMSToEverybody");

async function checkPlannedMeals(){
    const mealsState = await checkIfMealIsReady.checkMealList();

    let notReadyMeals = [];
    for(mealState of mealsState){
        if(!mealState.ready) notReadyMeals.push(mealState);
    }

    if(notReadyMeals.length > 0){
        let message = "";
        for(mealNotReady of notReadyMeals){
            message += "Le repas " + mealNotReady.title + " n'est pas prêt";
        }
        return message;
    }else{
        return "";
    }
}

async function checkPantry(){
    let almostExpired = await handlePantry.checkPantryExpiration();
    let message = "Les ingrédients suivants vont périmer : ";

    for(element of almostExpired){
        message += element.ingredientName + "(" + element.quantity + ")(" + element.expirationDate + ")";
    }
    return message;
}

exports.dailyCheck = async function(){
    let messageToSend = "";
    messageToSend += await checkPlannedMeals();
    messageToSend += await checkPantry();

    smsSender.sendSMS(messageToSend);
}
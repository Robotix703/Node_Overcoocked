const checkIfMealIsReady = require("../compute/handleMeal");
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

exports.dailyCheck = async function(){
    let messageToSend = "";
    messageToSend += await checkPlannedMeals();

    smsSender.sendSMS(messageToSend);
}
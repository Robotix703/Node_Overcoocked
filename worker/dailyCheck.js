const checkIfMealIsReady = require("../compute/checkIfMealIsReady");

async function checkPlannedMeals(){
    let mealsState = await checkIfMealIsReady.checkMealList();

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

    console.log(messageToSend)
}
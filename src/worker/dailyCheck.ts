import { handleMeal } from "../compute/handleMeal";
import { handlePantry } from "../compute/handlePantry";

import { sendSMSToEverybody } from "./sendSMSToEverybody";

async function checkPlannedMeals() : Promise<string> {
    await handleMeal.initPantryInventory();
    const mealsState : any = await handleMeal.checkMealList();
    const mealTotal : number = await handleMeal.getMealNumber();

    let notReadyMeals = [];
    let almostExpiredMeals = [];
    for(let mealState of mealsState){
        if(mealState.state.ingredientUnavailable) notReadyMeals.push(mealState);
        else if(mealState.state.ingredientAlmostExpire) almostExpiredMeals.push(mealState);
    }

    if(notReadyMeals.length > 0){
        let message = "";
        for(let mealNotReady of notReadyMeals){
            message += "Le repas " + mealNotReady.title + " n'est pas prêt\n";
        }

        for(let mealAlmostExpire of almostExpiredMeals){
            message += "Le repas " + mealAlmostExpire.title + " va bientôt périmer\n";
        }

        if(mealTotal == notReadyMeals.length){
            message += "ATTENTION aucun repas n'est prêt\n";
        }

        return message;
    }else{
        return "";
    }
}

async function checkPantry() : Promise<string> {
    let almostExpired : any[] = await handlePantry.checkPantryExpiration();

    let message = "";
    if(almostExpired.length > 0)
    {
        message = "\nLes ingrédients suivants vont périmer :\n";

        for(let element of almostExpired){
            message += element.ingredientName + " (Qty: " + element.quantity + ")(Exp: " + element.expirationDate + ")\n";
        }
    }
    return message;
}

export default async function dailyCheck() : Promise<void> {
    let messageToSend : string = "Information du jour\n\n";
    messageToSend += await checkPlannedMeals();
    messageToSend += await checkPantry();
    messageToSend += "\nhttps://overcooked.robotix703.fr/meal/list"

    sendSMSToEverybody.sendSMS(messageToSend);
}
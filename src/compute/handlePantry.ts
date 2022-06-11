import { IUpdateOne } from "../models/mongoose";
import { IPantry } from "../models/pantry";
import { baseIngredient } from "./base/ingredient";
import { basePantry } from "./base/pantry";

declare global {
    interface Date {
       addDays(days: number, useThis?: boolean): Date;
       isToday(): boolean;
       clone(): Date;
       isAnotherMonth(date: Date): boolean;
       isWeekend(): boolean;
       isSameDate(date: Date): boolean;
       getStringDate(): String;
    }
 }

Date.prototype.addDays = function (days : number) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function removePantry(PantryID : string) : Promise<void> {
    await basePantry.deletePantryByID(PantryID);
}

export namespace handlePantry {

    export async function freezePantry(pantryID : string) : Promise<IUpdateOne> {
        let pantry : IPantry = await basePantry.getByID(pantryID);
        pantry.frozen = true;
        return basePantry.updatePantryWithPantry(pantry);
    }

    export async function checkPantryExpiration() : Promise<any[]> {
        let allPantry : IPantry[] = await basePantry.getAllPantryWithExpirationDate();
    
        let dateNow : Date = new Date();
        dateNow = dateNow.addDays(3);
    
        let almostExpired : any[] = [];
        for (let pantry of allPantry) {
            if (pantry.expirationDate) {
                if (pantry.expirationDate.getTime() < Date.now()) {
                    await removePantry(pantry._id);
                }
                else if (pantry.expirationDate.getTime() < dateNow.getTime()) {
                    let ingredientName : string = await baseIngredient.getIngredientNameByID(pantry.ingredientID);
                    almostExpired.push({
                        ingredientName: ingredientName,
                        quantity: pantry.quantity,
                        expirationDate: pantry.expirationDate.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })
                    })
                }
            }
        }
        return almostExpired;
    }
}
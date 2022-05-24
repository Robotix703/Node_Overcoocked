const PantryForHandlePantry = require("../models/pantry");
const basePantryForHandlePantry = require("./base/pantry");
const baseIngredientForHandlePantry = require("./base/ingredient");

declare interface Date {
    addDays: (days : number) => Date
}

Date.prototype.addDays = function (days : number) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function removePantry(PantryID : string) {
    await basePantry.deletePantryByID(PantryID);
}

exports.freezePantry = async function (pantryID : string) {
    let pantry = await Pantry.findById(pantryID);
    pantry.frozen = true;
    return Pantry.updateOne({ _id: pantryID }, pantry);
}

exports.checkPantryExpiration = async function () {
    let allPantry = await basePantry.getAllPantryWithExpirationDate();

    let dateNow = new Date();
    dateNow = dateNow.addDays(3);

    let almostExpired = [];
    for (let pantry of allPantry) {
        if (pantry.expirationDate) {
            if (pantry.expirationDate.getTime() < Date.now()) {
                await removePantry(pantry._id);
            }
            else if (pantry.expirationDate.getTime() < dateNow.getTime()) {
                let ingredientName = await baseIngredient.getIngredientNameByID(pantry.ingredientID);
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
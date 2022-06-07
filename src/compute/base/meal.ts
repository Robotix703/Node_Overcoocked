import { IDeleteOne } from "../../models/mongoose";
import { meal } from "../../models/meal";

const Meal = require("../../models/meal");

exports.getMealByID = async function(mealID : string) : Promise<meal> {
    return Meal.findById(mealID);
}

exports.getAllMeals = async function() : Promise<meal> {
    return Meal.find();
}

exports.deleteMeal = async function(mealID : string) : Promise<IDeleteOne> {
    return Meal.deleteOne({ _id: mealID });
}
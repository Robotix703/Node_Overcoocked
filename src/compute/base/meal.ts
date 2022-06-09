import { IDeleteOne } from "../../models/mongoose";
import Meal, { IMeal } from "../../models/meal";

exports.getMealByID = async function(mealID : string) : Promise<IMeal> {
    return Meal.findById(mealID);
}

exports.getAllMeals = async function() : Promise<IMeal> {
    return Meal.find();
}

exports.deleteMeal = async function(mealID : string) : Promise<IDeleteOne> {
    return Meal.deleteOne({ _id: mealID });
}
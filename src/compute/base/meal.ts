import { IDeleteOne } from "../../models/mongoose";
import Meal, { IMeal } from "../../models/meal";

export namespace baseMeal {

    export async function getMealByID(mealID : string) : Promise<IMeal> {
        return Meal.findById(mealID);
    }

    export async function getAllMeals() : Promise<IMeal[]> {
        return Meal.find();
    }

    export async function deleteMeal(mealID : string) : Promise<IDeleteOne> {
        return Meal.deleteOne({ _id: mealID });
    }
}
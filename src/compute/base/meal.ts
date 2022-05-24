const Meal = require("../../models/meal");

exports.getMealByID = async function(mealID : string){
    return Meal.findById(mealID);
}

exports.getAllMeals = async function(){
    return Meal.find();
}

exports.deleteMeal = async function(mealID : string){
    return Meal.deleteOne({ _id: mealID });
}
const Meal = require("../../models/meal");

exports.getMealByID = async function(mealID){
    return Meal.findById(mealID).then((documents) =>{
        return documents;
    });
}
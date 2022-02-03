const Pantry = require("../models/pantry");

exports.freezePantry = async function(pantryID){
    let pantry = await Pantry.findById(pantryID);
    pantry.frozen = true;
    return Pantry.updateOne({ _id: pantryID }, pantry);
}
const user = require("../../models/user");

exports.getAllUserPhoneNumber = async function(){
    let users = await user.find();

    return users.map(e => e.phoneNumber);
}
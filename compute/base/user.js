const user = require("../../models/user");

exports.getAllUserPhoneNumber = async function(){
    return user.find().then((result) => {
        return result.map(e => e.phoneNumber);
    });
}
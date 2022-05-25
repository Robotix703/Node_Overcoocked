const user = require("../../models/user");

exports.getAllUserPhoneNumber = async function(){
    return user.find().then((result : any) => {
        return result.map((e : any) => e.phoneNumber);
    });
}
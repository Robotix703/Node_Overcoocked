import { userType } from "../../models/user";

const user = require("../../models/user");

exports.getAllUserPhoneNumber = async function() : Promise<string[]>{
    return user.find().then((results : userType[]) => {
        return results.map((e : userType) => e.phoneNumber);
    });
}
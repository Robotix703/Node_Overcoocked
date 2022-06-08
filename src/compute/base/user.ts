import { IUser } from "../../models/user";

const user = require("../../models/user");

exports.getAllUserPhoneNumber = async function() : Promise<string[]>{
    return user.find().then((results : IUser[]) => {
        return results.map((e : IUser) => e.phoneNumber);
    });
}
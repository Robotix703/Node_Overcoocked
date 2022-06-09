import User, { IUser } from "../../models/user";

exports.getAllUserPhoneNumber = async function() : Promise<string[]>{
    return User.find().then((results : IUser[]) => {
        return results.map((e : IUser) => e.phoneNumber);
    });
}
import { baseUser } from "../compute/base/user";

const smsSender = require("../modules/sms");
const Frindicator = "0033";

let g_phoneNumbers : any = [];

function processPhoneNumber(phoneNumbers : any[]){
    phoneNumbers.forEach((phoneNumber) => {
        g_phoneNumbers.push(
            Frindicator + phoneNumber.slice(1)
        );
    });
}

exports.fetchPhoneNumber = async function(){
    const phoneNumbers = await baseUser.getAllUserPhoneNumber();
    processPhoneNumber(phoneNumbers);
}

exports.sendSMS = function(message : string){
    if(process.env.NODE_ENV === "production"){
        smsSender.SendSMS(g_phoneNumbers, message);
    }
    console.log("SMS : " + message);
}
const baseUser = require("../compute/base/user");
const smsSender = require("../modules/sms/sms");
const Frindicator = "0033";

let g_phoneNumbers = [];

function processPhoneNumber(phoneNumbers){
    phoneNumbers.forEach((phoneNumber) => {
        g_phoneNumbers.push(
            Frindicator + phoneNumber.slice(1)
        );
    });
}

exports.fetchPhoneNumber = async function(){
    let phoneNumbers = await baseUser.getAllUserPhoneNumber();

    processPhoneNumber(phoneNumbers);
}

exports.sendSMS = function(message){
    if(process.env.NODE_ENV === "production"){
        smsSender.SendSMS(g_phoneNumbers, message);
    }
    console.log("SMS : " + message);
}
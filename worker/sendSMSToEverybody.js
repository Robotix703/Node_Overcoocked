const baseUser = require("../compute/base/user");
const smsSender = require("../modules/sms/sms");

let g_phoneNumbers = [];

function processPhoneNumber(phoneNumbers){
    phoneNumbers.forEach((phoneNumber) => {
        g_phoneNumbers.push(
            process.env.INDFR + phoneNumber.slice(1)
        );
    });
}

exports.fetchPhoneNumber = async function(){
    let phoneNumbers = await baseUser.getAllUserPhoneNumber();

    processPhoneNumber(phoneNumbers);
}

exports.sendSMS = function(message){
    //smsSender.SendSMS(g_phoneNumbers, message);
    console.log("SMS : " + message);
}
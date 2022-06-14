import { baseUser } from "../compute/base/user";

import SendSMS from "../modules/sms";

const Frindicator = "0033";
let g_phoneNumbers : any = [];

function processPhoneNumber(phoneNumbers : any[]) : void {
    phoneNumbers.forEach((phoneNumber) => {
        g_phoneNumbers.push(
            Frindicator + phoneNumber.slice(1)
        );
    });
}

export namespace sendSMSToEverybody {
    export async function fetchPhoneNumber() : Promise<void> {
        const phoneNumbers : string[] = await baseUser.getAllUserPhoneNumber();
        processPhoneNumber(phoneNumbers);
    }
    
    export function sendSMS(message : string) : void {
        if(process.env.NODE_ENV === "production"){
            SendSMS(g_phoneNumbers, message);
        }
        console.log("SMS : " + message);
    }
}
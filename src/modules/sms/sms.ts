require('dotenv').config()

var ovh = require('ovh')({
    endpoint: 'ovh-eu',
    appKey: process.env.OVHAPPKEY,
    appSecret: process.env.OVHAPPSECRET,
    consumerKey: process.env.OVHCONSKEY
});

export function SendSMS(receivers : any, message : string){
    ovh.request('GET', '/sms', function (err : Error, serviceName : string) {
        if(err) {
            console.error("SendSMS - " + err, serviceName);
        }
        else {
            ovh.request('POST', '/sms/' + serviceName + '/jobs', {
                message: message,
                sender: "Robotix703",
                noStopClause: true,
                receivers: receivers
                
            }, function (errsend : any, result : any) {
                if(errsend) console.error(errsend, result);
            });
        }
    });
}
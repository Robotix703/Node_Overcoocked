require('dotenv').config()

var ovh = require('ovh')({
    endpoint: 'ovh-eu',
    appKey: process.env.OVHAPPKEY,
    appSecret: process.env.OVHAPPSECRET,
    consumerKey: process.env.OVHCONSKEY
});

function SendSMS(receivers, message){
    ovh.request('GET', '/sms', function (err, serviceName) {
        if(err) {
            console.error("SendSMS - " + err, serviceName);
        }
        else {
            ovh.request('POST', '/sms/' + serviceName + '/jobs', {
                message: message,
                sender: "Robotix703",
                noStopClause: true,
                receivers: receivers
                
            }, function (errsend, result) {
                if(errsend) console.error(errsend, result);
            });
        }
    });
}

module.exports = {SendSMS}
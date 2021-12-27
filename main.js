var SMS = require("./sms/sms");

let tel = process.env.INDFR + process.env.TEL;

SMS.SendSMS([tel], "Hello World !!");
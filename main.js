const SMS = require("./sms/sms");
const Azure = require("./Azure/main");


let tel = process.env.INDFR + process.env.TEL;
//SMS.SendSMS([tel], "Hello World !!");

Azure.GetTasks();